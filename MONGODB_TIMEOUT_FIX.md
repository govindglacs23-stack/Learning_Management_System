# ⏱️ MongoDB Timeout Error - Complete Fix

## The Error

```
Operation `users.findOne()` buffering timed out after 10000ms
```

**Translation:** Backend tried to connect to MongoDB for 10 seconds and gave up.

---

## 🚨 Root Causes

1. **MongoDB is not running** (Most common)
2. **Wrong connection string in `.env`**
3. **MongoDB service crashed**
4. **Port 27017 blocked**
5. **MongoDB not installed**

---

## ✅ Quick Fix (5 minutes)

### Step 1: Check if MongoDB is Running

Open **new Command Prompt** and run:

```bash
mongosh
```

**If you see:**
```
mongosh>
```
→ MongoDB is running ✅

**If you see:**
```
Error: connect ECONNREFUSED
Could not connect to server
```
→ MongoDB is NOT running ❌

### Step 2: Start MongoDB (if not running)

**Option A: If you installed MongoDB locally**

Open **new Command Prompt** and run:

```bash
mongod
```

Wait for this message:
```
waiting for connections on port 27017
```

Then **LEAVE IT RUNNING** and go to Step 3.

**Option B: If you never installed MongoDB**

Download and install from: https://www.mongodb.com/try/download/community

Then run `mongod`

**Option C: Using MongoDB Atlas (Cloud)**

Skip to "Using MongoDB Atlas" section below

### Step 3: Test MongoDB Connection

In a **different Command Prompt**, run:

```bash
mongosh
```

If it connects → Good ✅

Type `exit` to close it

### Step 4: Restart Backend

In your backend Command Prompt:

```
Press Ctrl + C (to stop current process)
```

Then run:

```bash
npm run dev
```

Wait for:
```
Server running on port 5000
MongoDB Connected: localhost
```

**If you see "MongoDB Connected" → Problem is FIXED!**

### Step 5: Test Registration

Go to http://localhost:3000 and try registering again.

---

## 🗄️ Using MongoDB Atlas (Cloud)

If you want to use cloud MongoDB instead of local:

### Step 1: Create Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Create free account

### Step 2: Create a Cluster

1. Click "Create Deployment"
2. Choose "Free" tier
3. Choose "AWS" and any region
4. Click "Create Deployment"
5. Wait 2-3 minutes for cluster to be created

### Step 3: Get Connection String

1. Click "Connect"
2. Choose "Drivers"
3. Select "Node.js" version 4.0+
4. Copy the connection string
5. It will look like:
```
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### Step 4: Update .env

1. Open: `backend/.env`
2. Find the line: `MONGODB_URI=...`
3. Replace with your Atlas string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority
```
4. Save the file

### Step 5: Whitelist Your IP

1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 6: Restart Backend

```bash
Ctrl + C (in backend terminal)
npm run dev
```

Wait for: `MongoDB Connected`

---

## 🔧 Detailed Troubleshooting

### If "MongoDB is not installed"

**Option 1: Install MongoDB Community Edition**

1. Download: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Let it install MongoDB as a service

**Then run in Command Prompt:**

```bash
mongod
```

### If "MongoDB service not starting"

Try these commands in Command Prompt (as Administrator):

```bash
# Stop the service
net stop MongoDB

# Start the service
net start MongoDB

# Or run mongod directly
mongod
```

### If "Port 27017 blocked"

Check if another process is using port 27017:

```bash
netstat -ano | findstr :27017
```

If something is using it, change MongoDB port in `mongod.conf`:

```
port: 27018
```

Then update `.env`:

```
MONGODB_URI=mongodb://localhost:27018/lms
```

### If "Wrong connection string"

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/lms
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority
```

---

## 📋 Step-by-Step Verification

Run these commands in separate Command Prompts:

**Terminal 1: Start MongoDB**
```bash
mongod
```
Output should include:
```
waiting for connections on port 27017
```

**Terminal 2: Test MongoDB**
```bash
mongosh
```
Output should be:
```
mongosh>
```

**Terminal 3: Start Backend**
```bash
cd C:\Users\gopal\OneDrive\Desktop\LMS\backend
npm run dev
```
Output should be:
```
Server running on port 5000
MongoDB Connected: localhost
```

**Terminal 4: Test API**
```bash
curl http://localhost:5000/api/health
```
Output should be:
```json
{"success":true,"message":"Server is running"}
```

If all 4 work → Try registration! ✅

---

## 🚀 Complete Setup Guide

### Option 1: Local MongoDB (Recommended for beginners)

```bash
# Terminal 1
mongod

# Terminal 2
cd backend
npm run dev

# Terminal 3
cd frontend
npm run dev

# Terminal 4 (test)
curl http://localhost:5000/api/health
```

### Option 2: MongoDB Atlas (Cloud)

```bash
# Terminal 1: (mongod not needed)

# Terminal 2
cd backend
npm run dev

# Terminal 3
cd frontend
npm run dev

# Terminal 4 (test)
curl http://localhost:5000/api/health
```

---

## ✅ Verification Checklist

Before trying registration:

- [ ] MongoDB service is running
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Backend terminal shows "MongoDB Connected"
- [ ] Can run: `curl http://localhost:5000/api/health`
- [ ] Response is: `{"success":true,"message":"Server is running"}`
- [ ] Frontend is running on http://localhost:3000
- [ ] Browser console (F12) has no errors

---

## 🎯 The Most Common Fix

**99% of the time, this fixes the timeout error:**

```bash
# Terminal 1
mongod

# Wait 2 seconds

# Terminal 2
cd C:\Users\gopal\OneDrive\Desktop\LMS\backend
npm run dev

# Wait for "MongoDB Connected"

# Then try registration
```

---

## 🐛 Specific Error Messages

### "connect ECONNREFUSED 127.0.0.1:27017"
```
❌ MongoDB not running
✅ Run: mongod
```

### "getaddrinfo ENOTFOUND cluster.mongodb.net"
```
❌ Wrong Atlas connection string or no internet
✅ Check connection string in .env
✅ Check internet connection
```

### "authentication failed"
```
❌ Wrong username/password in connection string
✅ Get new string from Atlas console
✅ Make sure password doesn't have special characters
   (use URL encoding if it does)
```

### "MongoNetworkError: failed to connect to server"
```
❌ MongoDB server crashed or stopped
✅ Restart MongoDB
✅ Check logs for errors
```

---

## 💡 Pro Tips

1. **Always start MongoDB first** before backend
2. **Keep MongoDB running** in a separate terminal
3. **Don't close the MongoDB terminal** during development
4. **Use Atlas for easier setup** if you have internet
5. **Check error messages carefully** - they tell you what's wrong

---

## 📞 Still Getting Timeout?

Try these in order:

1. **Restart everything:**
   ```bash
   # Kill all node processes
   taskkill /F /IM node.exe
   
   # Restart MongoDB
   mongod
   
   # Restart backend
   npm run dev
   ```

2. **Reinstall backend:**
   ```bash
   cd backend
   rmdir /s node_modules
   del package-lock.json
   npm install
   npm run dev
   ```

3. **Restart your computer** (clears all processes)

4. **Check Windows Firewall** - may be blocking port 27017

5. **Uninstall and reinstall MongoDB**

---

## 🆘 Can't Install MongoDB?

Use **MongoDB Atlas** instead:

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster
4. Get connection string
5. Update `.env` with connection string
6. Done!

---

## Summary

**The timeout error means MongoDB isn't connected.**

**99% fix:**
1. Open Command Prompt
2. Run: `mongod`
3. Open another Command Prompt
4. Run: `cd backend && npm run dev`
5. Wait for "MongoDB Connected"
6. Try registration

If that doesn't work, follow the detailed steps above.

