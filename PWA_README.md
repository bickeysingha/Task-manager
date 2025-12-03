# Task Manager Pro - PWA with Email Authentication

A **Progressive Web App (PWA)** for managing tasks with email-based authentication, offline support, and cross-platform compatibility.

## ✨ Features

### PWA Features
- 📱 **Installable** - Add to home screen on mobile and desktop
- 🔌 **Offline Support** - Full functionality when offline with automatic sync
- 🔔 **Push Notifications** - Task reminders and updates
- 🎨 **Responsive Design** - Works perfectly on all screen sizes
- ⚫ **Dark Mode** - Built-in dark theme support
- ⚡ **Fast & Lightweight** - Optimized performance
- 🔒 **Secure** - HTTPS ready, token-based authentication

### Core Features
- ✅ Create, edit, and delete tasks
- 📅 Set due dates and get reminders
- 🎯 Track progress with visual indicators
- 🔄 Drag and drop to reorder tasks
- 👤 Email-based user authentication
- ✉️ Email verification
- 🔑 Password reset functionality
- 🌙 Theme switching
- 💾 Auto-sync between devices

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- npm or yarn
- Cloudant database account (IBM Cloud)
- Gmail account (for email notifications) or other email service

### Installation

1. **Clone/Download the project**
```bash
cd Task-manager-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
# - Cloudant database credentials
# - Email service credentials
# - App URL
```

#### Configuration Details

**Cloudant Setup:**
1. Sign up at [IBM Cloud](https://cloud.ibm.com)
2. Create a Cloudant instance
3. Create two databases: `users` and `tasks`
4. Get your API key and URL
5. Add to `.env`:
```
CLOUDANT_URL=https://your-username.cloudant.com
CLOUDANT_APIKEY=your-api-key
```

**Email Setup (Gmail):**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Generate App Password
4. Add to `.env`:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Other Email Services:**
- Outlook: `EMAIL_SERVICE=outlook`
- Yahoo: `EMAIL_SERVICE=yahoo`
- Custom: Configure SMTP settings

4. **Start the server**
```bash
npm start
```

Server will run at `http://localhost:3000`

5. **Open in browser**
- Navigate to `http://localhost:3000/login.html`
- Create an account with email verification
- Start managing your tasks!

## 📱 Installing as PWA

### On Mobile/Tablet
1. Open the app in your browser
2. Look for "Install" or "Add to Home Screen" prompt
3. Tap to install
4. App launches in fullscreen mode

### On Desktop (Chrome/Edge)
1. Click the install icon in the address bar (⊕ icon)
2. Or: Menu → More Tools → Create Shortcut
3. Check "Open as window"
4. App launches in a window

## 🔧 Technical Architecture

### Backend (Node.js/Express)
```
server.js
├── Authentication Routes
│   ├── POST /register - Email registration with verification
│   ├── POST /login - Email + password login
│   ├── GET /verify - Email verification
│   ├── POST /forgot-password - Password reset request
│   └── POST /reset-password - Reset password with token
├── Task Routes
│   ├── GET /tasks - List user's tasks
│   ├── POST /tasks - Create task
│   ├── PUT /tasks/:id - Update task
│   └── DELETE /tasks/:id - Delete task
└── Middleware
    └── authRequired - Token-based auth middleware
```

### Frontend (Vanilla JS)
```
index.html ────── Main app page
login.html ──────── Authentication page
app.js ─────────── Task management logic
sw.js ──────────── Service Worker (offline support)
manifest.json ───── PWA configuration
style.css ──────── Styling & responsive design
```

### Database Schema

**Users Collection:**
```json
{
  "_id": "auto-generated",
  "name": "John Doe",
  "email": "john@example.com",
  "passwordHash": "bcrypted-password",
  "verified": true,
  "verificationToken": null,
  "verifiedAt": "2024-01-01T00:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Tasks Collection:**
```json
{
  "_id": "auto-generated",
  "text": "Complete project",
  "done": false,
  "ownerId": "user-id",
  "dueDate": "2024-01-15T14:30:00Z",
  "order": 1,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## 🔌 API Endpoints

### Authentication

**Register**
```
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { success: true, message: "...", userId: "..." }
```

**Login**
```
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: {
  token: "auth-token",
  userId: "user-id",
  name: "John Doe",
  email: "john@example.com"
}
```

**Email Verification**
```
GET /verify?token=verification-token
```

**Forgot Password**
```
POST /forgot-password
{ "email": "john@example.com" }
```

**Reset Password**
```
POST /reset-password
{ 
  "token": "reset-token",
  "password": "newPassword123"
}
```

### Tasks

**Get Tasks**
```
GET /tasks
Header: x-auth-token: <token>

Response: [
  {
    id: "task-id",
    text: "Task text",
    done: false,
    dueDate: "2024-01-15T14:30:00Z",
    order: 1
  }
]
```

**Create Task**
```
POST /tasks
Header: x-auth-token: <token>
Content-Type: application/json

{
  "text": "New task",
  "dueDate": "2024-01-15T14:30:00Z"
}
```

**Update Task**
```
PUT /tasks/:id
Header: x-auth-token: <token>

{
  "text": "Updated text",
  "done": true,
  "dueDate": null,
  "order": 2
}
```

**Delete Task**
```
DELETE /tasks/:id
Header: x-auth-token: <token>
```

## 🔐 Security Features

- ✅ **Bcrypt Password Hashing** - 10 salt rounds
- ✅ **Email Verification** - Prevent fake accounts
- ✅ **Token-Based Authentication** - Secure API access
- ✅ **CORS Protection** - Configurable cross-origin access
- ✅ **Password Reset Tokens** - 1-hour expiration
- ✅ **HTTPS Ready** - Production deployment ready

## 💾 Offline Functionality

The PWA works completely offline:
- **Cached Assets** - All static files cached on first load
- **IndexedDB** - Pending tasks stored locally
- **Background Sync** - Tasks sync when online
- **Offline Indicator** - User sees connection status

## 📊 Development

### Scripts
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-reload)
```

### Debugging
- Browser DevTools → Application tab → see Service Worker status
- Check Network tab for caching behavior
- Use DevTools → Storage → IndexedDB for offline data

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set CLOUDANT_URL=... CLOUDANT_APIKEY=...
heroku config:set EMAIL_USER=... EMAIL_PASSWORD=...
```

### Render.com
1. Connect GitHub repo
2. Set environment variables
3. Deploy with npm start

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

**Service Worker not registering?**
- Ensure HTTPS or localhost
- Check browser console for errors
- Clear cache and try again

**Emails not sending?**
- Verify email credentials in .env
- Check Gmail: Use app-specific password
- Verify sender email is authorized

**Tasks not syncing?**
- Check authToken is valid
- Verify Cloudant credentials
- Check Network tab for API errors

**PWA won't install?**
- Must be HTTPS (except localhost)
- Ensure manifest.json is valid
- Check browser requirements

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For issues and questions:
- Check the Troubleshooting section
- Review API documentation
- Check browser console for errors
- Verify environment configuration

---

**Made with ❤️ for productive task management**
