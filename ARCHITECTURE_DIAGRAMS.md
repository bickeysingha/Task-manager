# 📊 Task Manager PWA - Visual Architecture & Flow Diagrams

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROGRESSIVE WEB APP (PWA)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐      ┌──────────────────┐                 │
│  │   FRONTEND       │      │   SERVICE WORKER │                 │
│  │  (Client-Side)   │◄────►│   (Offline)      │                 │
│  │                  │      │                  │                 │
│  │ • login.html     │      │ • Caching        │                 │
│  │ • index.html     │      │ • Sync           │                 │
│  │ • app.js         │      │ • Background     │                 │
│  │ • style.css      │      │                  │                 │
│  └──────────────────┘      └──────────────────┘                 │
│         │                                                        │
│         │ HTTP/HTTPS                                             │
│         ▼                                                        │
│  ┌──────────────────────────────────────────┐                   │
│  │   NODE.JS BACKEND (Express API)          │                   │
│  │  • Authentication Endpoints              │                   │
│  │  • Task Management                       │                   │
│  │  • Email Service Integration             │                   │
│  │  • Session Management                    │                   │
│  └──────────────────────────────────────────┘                   │
│         │              │              │                          │
│         ▼              ▼              ▼                          │
│   ┌──────────┐  ┌─────────────┐  ┌──────────┐                   │
│   │ Cloudant │  │   Nodemailer │  │IndexedDB │                   │
│   │ Database │  │   (Email)    │  │ (Local)  │                   │
│   │          │  │              │  │          │                   │
│   │ • users  │  │ • Verify     │  │ • Pending│                   │
│   │ • tasks  │  │ • Password   │  │   Tasks  │                   │
│   └──────────┘  │   Reset      │  └──────────┘                   │
│                 │ • Reminders  │                                  │
│                 └─────────────┘                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 User Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   USER AUTHENTICATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

   ┌─────────┐                                            ┌─────────┐
   │ NEW     │                                            │ EXISTING│
   │ USER    │                                            │ USER    │
   └────┬────┘                                            └────┬────┘
        │                                                      │
        ▼                                                      ▼
   ┌──────────┐                                         ┌──────────┐
   │REGISTER  │                                         │  LOGIN   │
   │          │                                         │          │
   │Enter     │                                         │Enter     │
   │• Name    │                                         │• Email   │
   │• Email   │                                         │• Password│
   │• Password│                                         │          │
   └────┬─────┘                                         └────┬─────┘
        │                                                     │
        ▼                                                     ▼
   ┌──────────┐                                         ┌──────────┐
   │HASH PWD  │                                         │FIND USER │
   │GENERATE  │                                         │CHECK PWD │
   │TOKEN     │                                         │          │
   └────┬─────┘                                         └────┬─────┘
        │                                                     │
        ▼                                                     ▼
   ┌──────────┐                                         ┌──────────┐
   │SEND      │                                         │VERIFIED? │
   │VERIFY    │                                         │          │
   │EMAIL     │                                         │• YES ► OK│
   └────┬─────┘                                         │• NO  ►  ✗│
        │                                                └────┬─────┘
        ▼                                                     │
   ┌──────────┐         ┌────────────┐                       │
   │USER      │        │VERIFY      │                       │
   │CLICKS    │───────►│EMAIL       │                       │
   │LINK      │        │VERIFY      │                       │
   │          │        │SUCCESS     │                       │
   └────┬─────┘        └────┬───────┘                       │
        │                   │                               │
        │                   ▼                               │
        │            ┌──────────────┐                       │
        │            │REDIRECT TO   │                       │
        │            │LOGIN PAGE    │                       │
        │            └──────┬───────┘                       │
        │                   │                               │
        ▼                   ▼                               ▼
        └───────►┌──────────────────┐◄────────────────────┘
                 │ LOGIN SUCCESSFUL  │
                 │                   │
                 │Generate Auth Token│
                 │Save to localStorage
                 │Redirect to App    │
                 └──────────────────┘
```

## 📋 Task Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   TASK MANAGEMENT FLOW                            │
└─────────────────────────────────────────────────────────────────┘

   LOAD APP
        │
        ▼
   ┌──────────┐
   │CHECK     │
   │AUTH TOKEN│
   └─────┬────┘
         │
    ┌────┴────┐
    │          │
    NO        YES
    │          │
    ▼          ▼
 REDIRECT   ┌─────────┐     GET TASKS FROM API
 TO LOGIN   │LOAD TASKS◄─────────────────────┐
            └────┬────┘                      │
                 │                          │
        ┌────────┴────────┐                 │
        │                 │                 │
        ▼                 ▼                 │
    ┌────────┐       ┌──────────┐          │
    │RENDER  │       │CACHE     │          │
    │TASKS   │       │OFFLINE   │          │
    │        │       │          │          │
    │✓ DONE  │       └──────────┘          │
    │✗ TODO  │                             │
    └────────┘                             │
        │                                  │
        ▼                                  │
    ┌──────────────┐                       │
    │USER ACTIONS  │                       │
    │              │                       │
    │• CREATE      │                       │
    │• EDIT        │                       │
    │• DELETE      │                       │
    │• MARK DONE   │                       │
    │• REORDER     │                       │
    └──────┬───────┘                       │
           │                               │
           ▼                               │
    ┌─────────────┐                        │
    │SEND TO API  │───────────────────────►┘
    │            │
    │ Header:    │
    │ x-auth-    │
    │ token      │
    └─────┬──────┘
          │
    ┌─────┴──────┐
    │             │
 ONLINE      OFFLINE
    │             │
    ▼             ▼
 ┌────────┐   ┌─────────┐
 │UPDATE  │   │SAVE TO  │
 │CLOUD   │   │INDEXEDDB│
 │        │   │ (QUEUE) │
 └────────┘   └────┬────┘
    │              │
    ▼              ▼
 ┌─────────────┐  ┌──────────┐
 │SUCCESS/     │  │SYNC WHEN │
 │ERROR MSG    │  │ONLINE    │
 └─────────────┘  └──────────┘
```

## 🔐 Security & Authentication

```
┌─────────────────────────────────────────────────────────────────┐
│              SECURITY & AUTHENTICATION LAYERS                     │
└─────────────────────────────────────────────────────────────────┘

FRONTEND                          BACKEND
────────                          ───────

User Input                       
    │                            
    ▼                            
┌─────────────┐                  
│VALIDATION   │                  
│• Email regex│                  
│• Pwd length │                  
└──────┬──────┘                  
       │                         
       ▼                         
┌─────────────┐                  
│SEND HTTPS   │─────────────────►┌──────────────┐
│REQUEST      │                  │VALIDATE INPUT│
└─────────────┘                  │              │
                                 │• Format      │
                                 │• Length      │
                                 └──────┬───────┘
                                        │
                                        ▼
                                 ┌──────────────────┐
                                 │CHECK DATABASE    │
                                 │• User exists?    │
                                 │• Email unique?   │
                                 └──────┬───────────┘
                                        │
                                        ▼
                                 ┌──────────────────┐
                                 │HASH PASSWORD     │
                                 │• 10 rounds bcrypt│
                                 │• Secure storage  │
                                 └──────┬───────────┘
                                        │
                                        ▼
                                 ┌──────────────────┐
                                 │GENERATE TOKEN    │
                                 │• Random 24 bytes │
                                 │• Store in memory │
                                 └──────┬───────────┘
                                        │
                                        ▼
                    ┌──────────────────────────────┐
                    │RETURN TOKEN + USER DATA      │
    ┌───────────────┤TO FRONTEND                   │
    │               └──────────────────────────────┘
    │
    ▼
┌──────────────────┐
│STORE IN          │
│LOCALSTORAGE      │
│                  │
│• authToken       │
│• userEmail       │
│• userName        │
└──────┬───────────┘
       │
       ▼
┌──────────────────────────────┐
│SEND WITH EVERY API REQUEST   │
│                              │
│Header: x-auth-token: xxxxx   │
└──────────────────────────────┘
```

## 🔄 Offline Sync Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    OFFLINE SYNC FLOW                              │
└─────────────────────────────────────────────────────────────────┘

USER GOES OFFLINE
        │
        ▼
   CREATE TASK
        │
        ▼
   ┌──────────────┐
   │CHECK ONLINE  │
   │STATUS        │
   └──────┬───────┘
          │
          NO (OFFLINE)
          │
          ▼
   ┌───────────────────┐
   │SAVE TO INDEXEDDB  │
   │                   │
   │{                  │
   │ id: "offline_123" │
   │ text: "Task"      │
   │ dueDate: "..."    │
   │ done: false       │
   │}                  │
   └─────────┬─────────┘
             │
             ▼
   ┌──────────────────┐
   │SHOW "SAVED       │
   │OFFLINE" MESSAGE  │
   │                  │
   │🔌 Offline       │
   └──────────────────┘
             │
      USER COMES ONLINE
             │
             ▼
   ┌──────────────────┐
   │DETECT ONLINE     │
   │STATUS            │
   └────────┬─────────┘
            │
            ▼
   ┌────────────────────────┐
   │BACKGROUND SYNC HANDLER │
   │                        │
   │Get all pending tasks   │
   │from IndexedDB          │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │SEND TO API             │
   │ ┌──────────────────┐   │
   │ │Task 1 - Pending  │   │
   │ │Task 2 - Pending  │   │
   │ │Task 3 - Pending  │   │
   │ └──────────────────┘   │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │SYNC SUCCESSFUL?        │
   │                        │
   │• YES ► Delete from DB  │
   │• NO  ► Retry later     │
   └────────────────────────┘
```

## 🌐 File Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   FILE REQUEST FLOW (PWA)                         │
└─────────────────────────────────────────────────────────────────┘

USER REQUESTS PAGE
        │
        ▼
   ┌────────────────┐
   │SERVICE WORKER  │
   │INTERCEPTS      │
   │REQUEST         │
   └────────┬───────┘
            │
            ▼
        ┌─────────────────┐
        │IS IT CACHED?    │
        └────────┬────────┘
                 │
           ┌─────┴──────┐
           │             │
          YES            NO
           │             │
           ▼             ▼
        ┌────────┐   ┌──────────┐
        │RETURN  │   │FETCH FROM│
        │CACHED  │   │NETWORK   │
        │        │   │          │
        │⚡ FAST │   │📡 SLOW  │
        └────────┘   └────┬─────┘
           │              │
           │              ▼
           │         ┌──────────┐
           │         │SUCCESS?  │
           │         └────┬─────┘
           │              │
           │         ┌────┴────┐
           │         │          │
           │        YES        NO
           │         │          │
           │         ▼          ▼
           │    ┌─────────┐ ┌─────────┐
           │    │CACHE    │ │OFFLINE  │
           │    │COPY     │ │PAGE     │
           │    │RETURN   │ │RETURN   │
           │    └─────────┘ └─────────┘
           │         │          │
           └─────────┼──────────┘
                     │
                     ▼
                SHOW TO USER
```

## 📊 State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT                              │
└─────────────────────────────────────────────────────────────────┘

LOCALSTORAGE                    INDEXEDDB
(Key-Value, Persistent)         (Structured, Persistent)

┌──────────────┐               ┌──────────────────┐
│authToken     │               │pendingTasks      │
│              │               │                  │
│userEmail     │               │{                 │
│              │               │ id: "offline_1"  │
│userName      │               │ text: "Task"     │
│              │               │ dueDate: "..."   │
│theme         │               │}                 │
│              │               │                  │
│rememberMe    │               │{...}             │
│              │               │{...}             │
└──────────────┘               └──────────────────┘

         │                              │
         │ AUTO SYNCED                  │ MANUAL QUERY
         │ BETWEEN TABS                 │ WHEN NEEDED
         │                              │
         └──────────────────┬───────────┘
                            │
                            ▼
                      IN-MEMORY
                      ┌─────────────┐
                      │tasksCache   │
                      │             │
                      │[{...}, ...]│
                      │             │
                      │Loaded       │
                      │during app   │
                      │initialization
                      └─────────────┘
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCTION DEPLOYMENT                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐          ┌──────────────────┐
│  USERS' DEVICES │          │ PRODUCTION SERVER│
│                 │          │                  │
│ • Desktop       │  HTTPS   │ Node.js + Express│
│ • Mobile        │◄────────►│                  │
│ • Tablet        │          │ Port: 3000       │
│                 │          │                  │
│ PWA App         │          │ ┌──────────────┐ │
│ Installed Natively          │ │Health Check  │ │
│                 │          │ │Load Balancer │ │
└─────────────────┘          │ │Rate Limiting │ │
                             │ └──────────────┘ │
                             │                  │
                             │ ┌──────────────┐ │
                             │ │Session Cache │ │
                             │ │Redis/Memory  │ │
                             │ └──────────────┘ │
                             └────────┬─────────┘
                                      │
                    ┌─────────────────┼──────────────────┐
                    │                 │                  │
                    ▼                 ▼                  ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │  CLOUDANT    │  │   EMAIL SVC  │  │   LOGGING    │
            │  DATABASE    │  │   (SMTP)     │  │   SERVICE    │
            │              │  │              │  │              │
            │• users DB    │  │• Gmail       │  │• Error logs  │
            │• tasks DB    │  │• Outlook     │  │• Access logs │
            │              │  │• Custom SMTP │  │              │
            └──────────────┘  └──────────────┘  └──────────────┘
```

---

These diagrams show how all components work together in the Task Manager PWA system.

For detailed information, see the documentation files!
