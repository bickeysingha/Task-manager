# 🚀 Task Manager PWA - Quick Setup Guide

## What's New? ✨

Your Task Manager has been transformed into a **Progressive Web App (PWA)** with:
- ✅ Email-based authentication system
- ✅ Offline-first functionality
- ✅ Push notifications
- ✅ Installable on any device
- ✅ Professional UI/UX
- ✅ Dark mode support

## Files Created/Modified

### New Files:
- `login.html` - Email login/registration page
- `reset-password.html` - Password reset page
- `sw.js` - Service Worker for offline support
- `manifest.json` - PWA configuration
- `.env.example` - Environment variables template
- `PWA_README.md` - Comprehensive documentation

### Modified Files:
- `server.js` - Added email authentication endpoints
- `app.js` - Updated to work with email login
- `index.html` - Added PWA meta tags and features
- `package.json` - Added nodemailer dependency
- `style.css` - Enhanced styling for PWA

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

#### Get Cloudant Credentials:
1. Go to [IBM Cloud](https://cloud.ibm.com)
2. Create/login to your account
3. Create a Cloudant service
4. Create two databases:
   - `users` (for storing user accounts)
   - `tasks` (for storing tasks)
5. Generate an API key
6. Copy credentials

#### Get Email Credentials (Gmail):
1. Go to https://myaccount.google.com
2. Select "Security" from left menu
3. Enable "2-Step Verification"
4. After enabling, create "App passwords"
5. Select "Mail" and "Windows Computer"
6. Copy the 16-character password

#### Setup .env File:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

CLOUDANT_URL=https://YOUR-USERNAME.cloudant.com
CLOUDANT_APIKEY=YOUR-API-KEY

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=YOUR-16-CHAR-PASSWORD
```

### 3. Start the Server
```bash
npm start
```

Server runs at: `http://localhost:3000`

### 4. Access the App
- Open `http://localhost:3000/login.html` in your browser
- Create a new account with your email
- Check your email for verification link
- Login and start managing tasks!

## 📱 Install as PWA

### On Desktop (Chrome/Edge):
1. Visit the app in browser
2. Click the ⊕ icon in address bar
3. Click "Install"
4. App opens in its own window

### On Mobile:
1. Open app in Safari/Chrome
2. Tap Share menu
3. Select "Add to Home Screen"
4. App available on home screen

## 🔌 Using Offline

The app works completely offline:
- Create/edit/delete tasks while offline
- Tasks auto-sync when you're back online
- No data loss - everything saved locally

## 🧪 Testing Features

### Test Email Verification:
1. Register with your email
2. Check inbox for verification link
3. Click link to verify
4. Now you can login

### Test Password Reset:
1. On login page, click "Forgot password"
2. Enter your email
3. Check inbox for reset link
4. Click link and set new password

### Test Offline Mode:
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" from dropdown
4. Create a task
5. Come back online - task syncs!

## 📚 Key URLs

- **Login Page**: `http://localhost:3000/login.html`
- **Main App**: `http://localhost:3000/index.html` (redirects to login if not authenticated)
- **Password Reset**: `http://localhost:3000/reset-password.html?token=...`
- **API Docs**: See `PWA_README.md`

## 🔑 API Authentication

All task requests need this header:
```
x-auth-token: YOUR_AUTH_TOKEN
```

The token is returned after login and stored in localStorage automatically.

## 🐛 Troubleshooting

### "Cannot GET /login.html"
- Make sure server is running: `npm start`
- Check port 3000 is not in use

### Emails not sending
- Verify `.env` credentials
- Check Gmail app password (not account password)
- Enable "Less secure apps" if using non-Gmail

### Service Worker not registering
- Must be HTTPS (or localhost for dev)
- Check browser console for errors
- Disable browser extensions that block SW

### Tasks not appearing
- Check auth token is valid
- Verify Cloudant database exists
- Check Network tab in DevTools for errors

## 📞 Need Help?

1. Check `PWA_README.md` for detailed documentation
2. Review browser console for error messages
3. Check `.env` file is configured correctly
4. Verify all dependencies installed: `npm list`

## 🚀 Next Steps

- [x] Set up backend with email auth
- [x] Create PWA-ready frontend
- [ ] Deploy to production (Heroku/Render)
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS for production

## 📝 Production Deployment

When ready to deploy:

1. **Update APP_URL** in .env to your domain
2. **Enable HTTPS** (required for PWA)
3. **Update CORS** in server.js if needed
4. **Set NODE_ENV=production**
5. **Use strong database credentials**
6. **Generate new API keys**

### Deploy to Render.com:
```bash
git push origin main  # Push to GitHub
# Connect repo to Render.com
# Add environment variables
# Deploy!
```

### Deploy to Heroku:
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set CLOUDANT_URL=...
heroku config:set EMAIL_USER=...
```

---

**Enjoy your new Task Manager PWA! 🎉**

For more details, see `PWA_README.md`
