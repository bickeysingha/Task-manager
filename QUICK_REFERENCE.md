# 📌 Quick Reference Card

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Start with auto-reload (install nodemon first)
npm install -D nodemon
npm run dev

# Check if running
curl http://localhost:3000/health
```

## 🔗 Important URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:3000/login.html` | Login/Register page |
| `http://localhost:3000/index.html` | Main app (redirects to login if not auth) |
| `http://localhost:3000/reset-password.html?token=...` | Password reset page |
| `http://localhost:3000/` | API health check |

## 📝 API Endpoints (Quick Reference)

```
POST /register
├─ Body: { name, email, password }
└─ Returns: { success, message, userId }

POST /login
├─ Body: { email, password }
└─ Returns: { token, userId, name, email }

GET /verify?token=xyz
└─ Verifies email

POST /forgot-password
├─ Body: { email }
└─ Sends reset email

POST /reset-password
├─ Body: { token, password }
└─ Resets password

GET /tasks (needs x-auth-token header)
└─ Returns: [{ id, text, done, dueDate, order }]

POST /tasks (needs x-auth-token header)
├─ Body: { text, dueDate }
└─ Returns: { success, id }

PUT /tasks/:id (needs x-auth-token header)
├─ Body: { text?, done?, dueDate?, order? }
└─ Returns: { success, id }

DELETE /tasks/:id (needs x-auth-token header)
└─ Returns: { success }

POST /logout (needs x-auth-token header)
└─ Returns: { success, message }
```

## 🗂️ File Locations

| File | Purpose |
|------|---------|
| `login.html` | Email authentication page |
| `index.html` | Main task app |
| `reset-password.html` | Password recovery |
| `app.js` | Frontend logic |
| `style.css` | Styling |
| `server.js` | Backend API |
| `sw.js` | Service Worker |
| `manifest.json` | PWA config |
| `.env` | Environment variables |

## 🔑 Environment Variables

```
# Server
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# Database
CLOUDANT_URL=https://...
CLOUDANT_APIKEY=...

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=...@gmail.com
EMAIL_PASSWORD=...
```

## 🚨 Common Issues & Fixes

| Error | Fix |
|-------|-----|
| `Cannot GET /login.html` | Server not running: `npm start` |
| `No module: nodemailer` | Install: `npm install` |
| `EADDRINUSE: address already in use :::3000` | Port in use: `kill -9 PID` or change PORT |
| Emails not sending | Check `.env` credentials, use Gmail app password |
| Service Worker error | Must be HTTPS or localhost |
| Tasks not appearing | Check browser console, verify auth token |
| PWA install button missing | Must be HTTPS or localhost |

## 💾 Browser Storage

| Storage | Type | Persistence | Use |
|---------|------|-------------|-----|
| localStorage | Key-value | Permanent | authToken, userEmail |
| sessionStorage | Key-value | Session only | Temporary data |
| IndexedDB | Structured | Permanent | Pending offline tasks |
| Cache API | Files | Permanent | Service Worker cache |

## 🧪 Test Cases

### Register
```javascript
// Valid
POST /register { name: "John", email: "j@g.com", password: "Pass123" }

// Invalid
POST /register { email: "invalid-email" } // Missing name, bad email
POST /register { name: "Jo", email: "j@g.com", password: "123" } // Short pwd
```

### Login
```javascript
// Valid
POST /login { email: "j@g.com", password: "Pass123" }

// Invalid
POST /login { email: "wrong@g.com", password: "Pass123" }
POST /login { email: "j@g.com", password: "wrong" }
```

### Create Task
```javascript
// Valid
POST /tasks { text: "Buy milk", dueDate: "2024-01-15T10:30:00Z" }

// Invalid (no auth token)
POST /tasks { text: "Task" } // Missing x-auth-token header
```

## 📱 PWA Features

| Feature | How to Use |
|---------|-----------|
| Install on Desktop | Click ⊕ in address bar → Install |
| Install on Mobile | Share menu → Add to Home Screen |
| Offline Mode | Just keep using, auto-syncs when online |
| Dark Mode | Toggle button in header |
| Notifications | Grant permission when prompted |
| Shortcuts | Right-click app icon → see shortcuts |

## 🔐 Security Checklist

- [ ] `.env` file not committed to git
- [ ] Use strong passwords (8+ chars)
- [ ] Email verification enabled
- [ ] HTTPS used in production
- [ ] API tokens expire
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Database access controlled

## 📊 Performance Tips

```javascript
// Frontend
- Use Service Worker caching
- Cache static assets
- Minimize API calls
- Use IndexedDB for local storage

// Backend
- Use database indexes
- Connection pooling
- Response compression
- Cache frequently accessed data
```

## 🔗 Useful Shortcuts

```bash
# Git commands
git add .
git commit -m "message"
git push

# Database queries (Cloudant)
GET http://localhost:5984/users/_all_docs
GET http://localhost:5984/tasks/_all_docs

# Terminal shortcuts
Ctrl+C = Stop server
Ctrl+L = Clear terminal
↑ = Previous command
```

## 🎯 Development Workflow

```
1. Make changes
   ↓
2. Save file (auto-reload if using nodemon)
   ↓
3. Test in browser
   ↓
4. Check DevTools (F12)
   ↓
5. Fix errors
   ↓
6. Commit to git
   ↓
7. Deploy
```

## 📚 Documentation Map

```
START_HERE.md ──────────► Begin here
    ↓
SETUP.md ────────────────► Step-by-step setup
    ├─ PWA_README.md ────► Full documentation
    ├─ DEVELOPER_GUIDE.md ─► Code examples
    └─ ARCHITECTURE_DIAGRAMS.md ─► Visual guides
```

## 🆘 Getting Help

1. **Check Documentation**: Start with `START_HERE.md`
2. **Look at Code**: Review comments in files
3. **Browser Console**: F12 → Console tab for errors
4. **Network Tab**: F12 → Network for API issues
5. **Check `.env`**: Verify configuration
6. **Server Logs**: Check terminal for errors
7. **Read Issues**: Look for similar problems

## ✅ Launch Checklist

```
Pre-Launch
- [ ] npm install successful
- [ ] .env configured
- [ ] Server starts
- [ ] Register works
- [ ] Login works
- [ ] Tasks CRUD works
- [ ] Offline works
- [ ] PWA installs
- [ ] Mobile responsive
- [ ] No console errors

Launch Day
- [ ] Double-check configs
- [ ] Test all features
- [ ] Check performance
- [ ] Test on mobile
- [ ] Try offline
- [ ] Verify emails
- [ ] Check logs
- [ ] Monitor uptime
```

## 💡 Pro Tips

1. **Use DevTools regularly** - F12 is your friend
2. **Keep console clean** - Fix all warnings
3. **Test on mobile** - Chrome DevTools mobile view
4. **Monitor logs** - Know what's happening
5. **Backup database** - Cloudant has backup tools
6. **Update dependencies** - `npm update` regularly
7. **Use git** - Always version control
8. **Document changes** - Update CHANGELOG

---

**Save this file and keep it handy!** 📌

For detailed help, see the other documentation files.
