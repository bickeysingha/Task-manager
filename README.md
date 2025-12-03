Task Manager – Progressive Web App

A modern, installable, offline-capable Task Manager PWA with a secure Node.js backend, email authentication, and seamless cloud sync.

📌 Overview

Task Manager is a full-stack Progressive Web App built to help users manage tasks efficiently from any device — desktop, tablet, or mobile.
The app works both online and offline, supports email-based authentication, and syncs tasks automatically when the network is available.

This project includes a complete frontend (HTML/CSS/JS), backend API (Node.js + Express), Cloudant database integration, and Service Worker–powered offline capabilities.

✨ Key Features
🔐 Authentication & Security

Email-based Registration & Login

Email Verification to activate accounts

Password Reset via Email (Forgot Password flow)

Secure password hashing (bcrypt)

Token-based authentication for all APIs

📝 Task Features

Create tasks

Edit tasks

Delete tasks

Mark tasks as done/undone

Set due dates

Auto-sync tasks across devices

Task ordering for better prioritization

📱 Progressive Web App (PWA)

Installable on Android, iOS, Windows, macOS

Works offline using Service Worker

Background sync for offline tasks

Optimized caching strategy for fast loading

App-like UI/UX with theme support

🔄 Offline Support

Tasks created offline are stored locally

Automatically synced to server when connection returns

IndexedDB used for storing pending tasks

Cache API used for static asset caching

🎨 Modern UI/UX

Mobile-first responsive layout

Clean dashboard design

Login/Register UI with validation

Dark mode support

Smooth interactions

🧱 Tech Stack
Frontend

HTML5

CSS3

JavaScript (Vanilla)

Service Worker

IndexedDB

Manifest.json

Backend

Node.js

Express.js

Nodemailer (Email sending)

Cloudant (IBM NoSQL database)

Security

bcrypt password hashing

Token-based authentication

Email verification tokens

Password reset tokens

📂 Folder Structure
Task-manager/
│
├── index.html              # Main App UI
├── login.html              # Login / Register page
├── reset-password.html     # Password reset UI
├── app.js                  # Frontend logic
├── style.css               # UI styling
├── sw.js                   # Service Worker (Offline + Sync)
├── manifest.json           # PWA configuration
│
├── server.js               # Backend API (Node + Express)
├── package.json            # Dependencies
├── .env.example            # Environment variables template
│
└── Documentation files...  # Setup guides, diagrams, summaries

How Offline Mode Works

User opens the app → Service Worker caches assets

If offline:

New tasks are stored in IndexedDB

When back online:

Background Sync sends all pending tasks to the server

Tasks automatically update in UI

This ensures the app behaves like a native application even without network access.

🛡 Security Model

All passwords hashed using bcrypt

Email verification tokens for signup

One-time secure tokens for password reset

API protected using authentication middleware

Database isolation per user (tasks belong only to their creator)

📱 PWA Installation
On Mobile

Open in Chrome/Safari

Tap Add to Home Screen

On Desktop

Chrome/Edge show an Install App icon in the address bar

Once installed, the app runs fullscreen like a native application.

🐛 Troubleshooting

Email not sending → Check .env email credentials

Cannot access login page → Ensure server is running

PWA not installing → Must be served via HTTPS (or localhost)

Tasks not syncing → Check network status & authentication token
