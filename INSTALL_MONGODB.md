# MongoDB Not Installed - Installation Guide

## The Problem

Running `mongod` gives error:
```
mongod is not recognized as the name of a cmdlet, function, script file, or operable program
```

**Translation:** MongoDB is not installed on your computer.

---

## 🎯 Choose ONE Option

### Option 1: Install MongoDB Community Edition (Local) - RECOMMENDED

This is recommended for beginners as it's easier to manage.

#### Step 1: Download MongoDB

Go to: https://www.mongodb.com/try/download/community

Select:
- **OS:** Windows
- **Version:** Latest (should be 7.0+ or later)
- Click "Download"

#### Step 2: Run Installer

1. Double-click the downloaded `.msi` file
2. Click "Next" on welcome screen
3. Accept license agreement
4. Choose "Complete" installation
5. Leave service configuration as default
6. Click "Install"
7. Wait for installation (2-5 minutes)
8. Click "Finish"

#### Step 3: Verify Installation

Open **new Command Prompt** and run:

```bash
mongod --version
```

Should show version number (e.g., `db version v7.0.0`).

#### Step 4: Test Connection

In **another Command Prompt**, run:

```bash
mongosh
```

Should show:
```
mongosh>
```

Type `exit` to close it.

#### Step 5: Run MongoDB

Now you can run:

```bash
mongod
```

Should show:
```
waiting for connections on port 27017
```

**LEAVE THIS TERMINAL OPEN** while using the app.

---

### Option 2: Use MongoDB Atlas (Cloud) - EASIEST FOR SETUP

This is cloud-based and requires no installation.

#### Step 1: Sign Up

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Start free"
3. Create account with email/Google
4. Verify email

#### Step 2: Create Cluster

1. Click "Create a Deployment"
2. Select "M0 Free Tier"
3. Choose cloud provider (AWS, Google Cloud, Azure) - any is fine
4. Choose region closest to you
5. Click "Create Deployment"
6. Wait 2-3 minutes for cluster to be created

#### Step 3: Create Database User

1. In left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Set username: `admin`
4. Set password: (choose something, remember it!)
5. Click "Add User"

#### Step 4: Whitelist Your IP

1. In left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

#### Step 5: Get Connection String

1. In left sidebar, click "Databases"
2. Click "Connect" button
3. Select "Drivers"
4. Select "Node.js"
5. Copy the connection string
6. It will look like:
```
mongodb+srv://admin:PASSWORD@cluster0.mongodb.net/?retryWrites=true&w=majority
```

#### Step 6: Update .env

1. Open: `backend/.env`
2. Find: `MONGODB_URI=...`
3. Replace with your connection string:
```
MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.mongodb.net/lms?retryWrites=true&w=majority
```
4. Save file

#### Step 7: Restart Backend

```bash
Ctrl + C (in backend terminal)
npm run dev
```

Wait for: `MongoDB Connected`

---

## 🚀 Next Steps After Installation

### For Local MongoDB:

**Terminal 1:**
```bash
mongod
```
(Leave running)

**Terminal 2:**
```bash
cd C:\Users\gopal\OneDrive\Desktop\LMS\backend
npm run dev
```

Wait for: `MongoDB Connected: localhost`

### For MongoDB Atlas:

Just update `.env` and restart backend:
```bash
npm run dev
```

Wait for: `MongoDB Connected`

Then try registration!

---

## ✅ Verification Checklist

After installation:

- [ ] `mongod --version` shows version number
- [ ] `mongosh` connects successfully
- [ ] Backend terminal shows "MongoDB Connected"
- [ ] Can register on http://localhost:3000

---

## 🆘 Troubleshooting

### If `mongod` still not recognized after installation

The MongoDB path wasn't added to system PATH.

**Fix:**

1. Open Command Prompt **as Administrator**
2. Run:
```bash
where mongod
```

If no result → MongoDB path not in PATH

**Add it manually:**

1. Open System Environment Variables:
   - Windows Search → "Environment Variables"
   - Click "Edit the system environment variables"
   - Click "Environment Variables" button

2. Under "System variables", click "Path" and "Edit"

3. Click "New" and add:
```
C:\Program Files\MongoDB\Server\7.0\bin
```

4. Click "OK" and restart Command Prompt

5. Try `mongod` again

### If MongoDB won't start after installation

1. Check if already running:
```bash
netstat -ano | findstr :27017
```

If something is using port 27017:
```bash
taskkill /PID <PID> /F
```

2. Start MongoDB service:
```bash
net start MongoDB
```

3. Or run mongod directly:
```bash
mongod
```

### If Atlas connection fails

**Error: "authentication failed"**
- Check username/password in connection string
- Make sure special characters are URL-encoded

**Error: "getaddrinfo ENOTFOUND cluster.mongodb.net"**
- Check internet connection
- Check connection string is correct

**Error: "Unable to connect to server"**
- Check IP is whitelisted in Network Access
- Wait a few minutes for cluster to start

---

## 📊 Local vs Cloud MongoDB

| Feature | Local | Atlas (Cloud) |
|---------|-------|---------------|
| Setup time | 10 minutes | 5 minutes |
| Cost | Free | Free (forever) |
| Performance | Fast (local) | Slight latency |
| Data backup | Manual | Automatic |
| Maintenance | You | MongoDB |
| **Recommended for:** | Development | Easy setup |

---

## 💡 Tips

1. **Always start MongoDB first** before backend
2. **Keep MongoDB running** in separate terminal
3. **Don't close MongoDB terminal** during development
4. **Use Atlas** if you have internet - it's easier
5. **Use local** if you want fastest performance

---

## Summary

**Local MongoDB Installation:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer
3. Run `mongod` in Command Prompt
4. Leave it running
5. Start backend in another terminal

**Cloud MongoDB (Atlas):**
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `backend/.env`
5. Start backend

Then try registration! 🎓

