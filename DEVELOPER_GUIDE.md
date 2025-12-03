# 🔧 Task Manager PWA - Code Examples & Developer Guide

## API Usage Examples

### 1. Registration Flow

```bash
# Register new user
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Response
{
  "success": true,
  "message": "Account created. Check your email to verify.",
  "userId": "user-123"
}
```

### 2. Email Verification

```bash
# User clicks link in email
GET http://localhost:3000/verify?token=verification-token-here
# Redirects to login.html?verified=true
```

### 3. Login Flow

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Response
{
  "token": "auth-token-here",
  "userId": "user-123",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 4. Create Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "x-auth-token: auth-token-here" \
  -d '{
    "text": "Complete project documentation",
    "dueDate": "2024-01-15T14:30:00Z"
  }'

# Response
{
  "success": true,
  "id": "task-123"
}
```

### 5. Get All Tasks

```bash
curl -X GET http://localhost:3000/tasks \
  -H "x-auth-token: auth-token-here"

# Response
[
  {
    "id": "task-123",
    "text": "Complete project documentation",
    "done": false,
    "dueDate": "2024-01-15T14:30:00Z",
    "order": 1
  }
]
```

### 6. Update Task

```bash
curl -X PUT http://localhost:3000/tasks/task-123 \
  -H "Content-Type: application/json" \
  -H "x-auth-token: auth-token-here" \
  -d '{
    "text": "Updated task text",
    "done": true,
    "order": 2
  }'
```

### 7. Delete Task

```bash
curl -X DELETE http://localhost:3000/tasks/task-123 \
  -H "x-auth-token: auth-token-here"
```

## JavaScript Client Examples

### Authenticate User

```javascript
async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      // Save auth token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', data.email);
      
      // Use token for future requests
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### Make Authenticated API Call

```javascript
async function getTasks() {
  const token = localStorage.getItem('authToken');
  
  try {
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'GET',
      headers: {
        'x-auth-token': token
      }
    });

    if (response.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login.html';
      return;
    }

    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }
}
```

### Create Task with Error Handling

```javascript
async function createTask(text, dueDate) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('Not authenticated');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({
        text: text.trim(),
        dueDate: dueDate || null
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create task');
    }

    console.log('Task created:', data.id);
    return data;
  } catch (error) {
    console.error('Error creating task:', error.message);
  }
}
```

## Environment Configuration Examples

### Development (.env)
```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

CLOUDANT_URL=https://user.cloudant.com
CLOUDANT_APIKEY=your-dev-key

EMAIL_SERVICE=gmail
EMAIL_USER=dev@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Production (.env)
```env
PORT=3000
NODE_ENV=production
APP_URL=https://your-domain.com

CLOUDANT_URL=https://prod-user.cloudant.com
CLOUDANT_APIKEY=your-prod-key

EMAIL_SERVICE=gmail
EMAIL_USER=noreply@your-domain.com
EMAIL_PASSWORD=your-app-password
```

## Docker Configuration

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      CLOUDANT_URL: ${CLOUDANT_URL}
      CLOUDANT_APIKEY: ${CLOUDANT_APIKEY}
      EMAIL_USER: ${EMAIL_USER}
      EMAIL_PASSWORD: ${EMAIL_PASSWORD}
    restart: always
```

## Testing Examples

### Test User Registration

```javascript
describe('User Registration', () => {
  test('should register user with valid email', async () => {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123'
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('should reject duplicate email', async () => {
    // Register first user
    await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User 1',
        email: 'duplicate@example.com',
        password: 'Pass123'
      })
    });

    // Try to register again with same email
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User 2',
        email: 'duplicate@example.com',
        password: 'Pass456'
      })
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('already registered');
  });
});
```

## Offline Mode Handling

### Store Task for Offline Sync

```javascript
function saveOfflineTask(text, dueDate) {
  const task = {
    id: 'offline_' + Date.now(),
    text: text,
    dueDate: dueDate || null,
    done: false,
    _offline: true
  };

  // Open IndexedDB
  const request = indexedDB.open('TaskManagerDB', 1);
  
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('pendingTasks')) {
      db.createObjectStore('pendingTasks', { keyPath: 'id' });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['pendingTasks'], 'readwrite');
    const store = transaction.objectStore('pendingTasks');
    store.add(task);
    
    console.log('Task saved offline:', task);
  };
}
```

### Sync Pending Tasks When Online

```javascript
async function syncPendingTasks() {
  const token = localStorage.getItem('authToken');
  
  const request = indexedDB.open('TaskManagerDB', 1);
  
  request.onsuccess = async (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['pendingTasks'], 'readonly');
    const store = transaction.objectStore('pendingTasks');
    const allPending = store.getAll();

    allPending.onsuccess = async (e) => {
      const tasks = e.target.result;
      
      for (const task of tasks) {
        try {
          const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify({
              text: task.text,
              dueDate: task.dueDate
            })
          });

          if (response.ok) {
            // Delete from pending after successful sync
            const deleteTransaction = db.transaction(['pendingTasks'], 'readwrite');
            deleteTransaction.objectStore('pendingTasks').delete(task.id);
          }
        } catch (error) {
          console.error('Failed to sync task:', error);
        }
      }
    };
  };
}

// Listen for online event
window.addEventListener('online', syncPendingTasks);
```

## Deployment Checklist

```markdown
## Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] HTTPS certificate ready
- [ ] Email service configured
- [ ] Rate limiting enabled
- [ ] Security headers added

## Deployment
- [ ] Build tested locally
- [ ] Environment variables set on server
- [ ] Database migrated
- [ ] Service started
- [ ] Health check endpoint responds
- [ ] SSL certificate installed
- [ ] DNS updated

## Post-Deployment
- [ ] Test login flow
- [ ] Test email verification
- [ ] Test password reset
- [ ] Test task creation
- [ ] Test PWA installation
- [ ] Monitor error logs
- [ ] Check performance metrics
```

## Monitoring & Debugging

### Enable Debug Logging

```javascript
// Add to server.js
const DEBUG = process.env.DEBUG === 'true';

function debugLog(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    debugLog(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});
```

### Monitor Service Worker

```javascript
// Check Service Worker status
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      console.log('SW Scope:', registration.scope);
      console.log('SW Update Available:', registration.updateViaCache);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            console.log('New Service Worker available');
            // Notify user to refresh
          }
        });
      });
    });
  });
}
```

## Common Code Patterns

### Retry Logic for Failed Requests

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // Retry on 5xx errors
      if (response.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

### Request Timeout

```javascript
function fetchWithTimeout(url, options = {}, timeout = 5000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}
```

---

**For more information, see:**
- `PWA_README.md` - Complete API documentation
- `SETUP.md` - Installation and setup guide
- `IMPLEMENTATION_SUMMARY.md` - Architecture overview
