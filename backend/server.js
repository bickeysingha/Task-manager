require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Cloudant = require("@cloudant/cloudant");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---- Cloudant connection ----
const cloudant = Cloudant({
  url: process.env.CLOUDANT_URL,
  plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_APIKEY } },
});

const db = cloudant.use("tasks");

// ---- Simple auth config ----
const APP_TOKEN = process.env.APP_TOKEN || "dev-token";
const APP_PASSWORD = process.env.APP_PASSWORD || "admin";

// ---- Auth middleware (for write operations) ----
function authRequired(req, res, next) {
  if (!APP_TOKEN) return next(); // if no token configured

  const token = req.header("x-auth-token");
  if (!token || token !== APP_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ---- Routes ----

// Test / health
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Task Manager API running" });
});

// Login: sends token if password correct
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password required" });

  if (password === APP_PASSWORD) {
    return res.json({ token: APP_TOKEN });
  } else {
    return res.status(401).json({ error: "Invalid password" });
  }
});

// Get all tasks (public read)
app.get("/tasks", async (req, res) => {
  try {
    const body = await db.list({ include_docs: true });
    const tasks = body.rows.map((row) => ({
      id: row.doc._id,
      text: row.doc.text,
      done: row.doc.done || false,
      createdAt: row.doc.createdAt,
    }));
    res.json(tasks);
  } catch (err) {
    console.error("Error getting tasks:", err);
    res.status(500).json({ error: err.toString() });
  }
});

// Add new task (auth required)
app.post("/tasks", authRequired, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }

  const task = {
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };

  try {
    const result = await db.insert(task);
    res.json({ success: true, id: result.id });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: err.toString() });
  }
});

// Update task (edit text and/or done) – auth required
app.put("/tasks/:id", authRequired, async (req, res) => {
  const { id } = req.params;

  try {
    // Always read the latest version
    const doc = await db.get(id);

    // Update fields
    if (req.body.text !== undefined) doc.text = req.body.text.trim();
    if (req.body.done !== undefined) doc.done = req.body.done;

    doc.updatedAt = new Date().toISOString();

    // Save updated doc (Cloudant handles rev automatically)
    const result = await db.insert(doc);

    res.json({ success: true, id: result.id });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.toString() });
  }
});


// Delete task – auth required
app.delete("/tasks/:id", authRequired, async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.get(id);
    await db.destroy(doc._id, doc._rev);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
