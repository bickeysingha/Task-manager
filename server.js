require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Cloudant = require("@cloudant/cloudant");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---- Cloudant connection ----
const cloudant = Cloudant({
  url: process.env.CLOUDANT_URL,
  plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_APIKEY } },
});

const db = cloudant.use("tasks");
const usersDb = cloudant.use("users");

// In-memory sessions: token -> userId
const sessions = {};

// Middleware: auth by token
async function authRequired(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token || !sessions[token]) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = sessions[token]; // attach userId to request
  next();
}


// ---- Routes ----

// Test / health
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Task Manager API running" });
});


// REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    // check if user exists
    const existing = await usersDb.find({ selector: { username } }).catch(() => null);
    if (existing && existing.docs && existing.docs.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const userDoc = {
      username,
      passwordHash: hashed,
      createdAt: new Date().toISOString(),
      type: "user",
    };

    const result = await usersDb.insert(userDoc);
    res.json({ success: true, userId: result.id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.toString() });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const result = await usersDb.find({ selector: { username } });
    if (!result.docs || result.docs.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.docs[0];
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = crypto.randomBytes(24).toString("hex");
    sessions[token] = user._id;

    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.toString() });
  }
});


app.get("/tasks", authRequired, async (req, res) => {
  try {
    const body = await db.find({
      selector: { ownerId: req.userId },
      sort: [{ order: "asc" }],
    }).catch(async () => {
      // if no index yet, fallback
      const all = await db.list({ include_docs: true });
      return {
        docs: all.rows
          .map(r => r.doc)
          .filter(d => d.ownerId === req.userId),
      };
    });

    const docs = body.docs || body;
    const tasks = docs.map((doc) => ({
      id: doc._id,
      text: doc.text,
      done: doc.done || false,
      createdAt: doc.createdAt,
      dueDate: doc.dueDate || null,
      order: doc.order || 0,
    }));
    res.json(tasks);
  } catch (err) {
    console.error("Error getting tasks:", err);
    res.status(500).json({ error: err.toString() });
  }
});


// Add new task (auth required)
app.post("/tasks", authRequired, async (req, res) => {
  const { text, dueDate } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // get current max order for this user
    const all = await db.find({ selector: { ownerId: req.userId } }).catch(() => ({ docs: [] }));
    const maxOrder = all.docs.reduce((max, t) => Math.max(max, t.order || 0), 0);

    const task = {
      text: text.trim(),
      done: false,
      createdAt: new Date().toISOString(),
      ownerId: req.userId,
      dueDate: dueDate || null,
      order: maxOrder + 1,
    };

    const result = await db.insert(task);
    res.json({ success: true, id: result.id });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: err.toString() });
  }
});



// Update task (edit text, done, dueDate, order) – auth required
app.put("/tasks/:id", authRequired, async (req, res) => {
  try {
    const doc = await db.get(req.params.id);

    // Update text
    if (typeof req.body.text === "string") {
      doc.text = req.body.text.trim();
    }

    // Update done flag
    if (typeof req.body.done === "boolean") {
      doc.done = req.body.done;
    }

    // Update due date
    if (req.body.dueDate !== undefined) {
      doc.dueDate = req.body.dueDate;   // store new date/time
    }

    // Update order
    if (typeof req.body.order === "number") {
      doc.order = req.body.order;
    }

    doc.updatedAt = new Date().toISOString();

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
