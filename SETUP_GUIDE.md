# 📋 GUILTY Game - Complete Setup Guide

This guide will walk you through setting up the GUILTY detective game from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
  - Check version: `node --version`
  - Download: https://nodejs.org/

- **npm** (v6.0.0 or higher)
  - Check version: `npm --version`
  - Comes with Node.js

- **Git** (optional, for cloning)
  - Check version: `git --version`
  - Download: https://git-scm.com/

## 🚀 Installation Steps

### Step 1: Get the Files

**Option A: Using Git**
```bash
git clone https://github.com/yourusername/guilty-game.git
cd guilty-game
```

**Option B: Manual Download**
1. Download all 11 files from the repository
2. Create a new folder called `guilty-game`
3. Place all files in this folder
4. Open terminal/command prompt in this folder

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express (web server)
- helmet (security headers)
- compression (performance)
- express-rate-limit (API protection)
- dotenv (environment variables)
- nodemon (development server)

### Step 3: Configure Environment

1. Copy the environment template:
```bash
cp .env.example .env
```

On Windows:
```cmd
copy .env.example .env
```

2. Edit `.env` file (optional):
```env
PORT=3000
NODE_ENV=development
```

### Step 4: Run the Game

**For Production:**
```bash
npm start
```

**For Development (auto-restart on changes):**
```bash
npm run dev
```

### Step 5: Access the Game

Open your web browser and navigate to:
```
http://localhost:3000
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
1. Change the port in `.env` file:
   ```env
   PORT=3001
   ```
2. Or kill the process using port 3000:
   - Mac/Linux: `lsof -ti:3000 | xargs kill`
   - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`

#### Module Not Found
**Error:** `Error: Cannot find module 'express'`

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Permission Denied
**Error:** `EACCES: permission denied`

**Solution:**
- Mac/Linux: Run with `sudo npm install`
- Windows: Run Command Prompt as Administrator

### Browser Issues

#### Game Not Loading
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Try a different browser
3. Check browser console for errors (F12)

#### Styling Issues
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Check that JavaScript is enabled

## 🐳 Docker Setup (Optional)

If you prefer using Docker:

1. Create a `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

2. Build and run:
```bash
docker build -t guilty-game .
docker run -p 3000:3000 guilty-game
```

## 🌐 Deployment Options

### Heroku
1. Install Heroku CLI
2. Create Heroku app:
```bash
heroku create your-app-name
git push heroku main
```

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`

### Traditional Hosting
1. Upload all files to your web server
2. Install Node.js on the server
3. Run `npm install` in the project directory
4. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name guilty-game
```

## 📁 File Structure Verification

Ensure you have all 11 files:
```
✓ index.html (47KB) - Main game file
✓ server.js (2KB) - Express server
✓ package.json (1KB) - Dependencies
✓ package-lock.json (auto-generated)
✓ .env.example - Environment template
✓ .env (created from .env.example)
✓ .gitignore - Git ignore rules
✓ LICENSE - MIT license
✓ README.md - Documentation
✓ SETUP_GUIDE.md - This file
✓ FILES_SUMMARY.md - File reference
✓ quick-start.sh - Mac/Linux script
✓ quick-start.bat - Windows script
```

## 🔒 Security Considerations

1. **Production Mode**: Set `NODE_ENV=production` in `.env`
2. **HTTPS**: Use a reverse proxy (nginx) for SSL
3. **Firewall**: Only expose necessary ports
4. **Updates**: Keep dependencies updated:
```bash
npm update
npm audit fix
```

## 📞 Support

If you encounter issues not covered here:

1. Check the browser console (F12) for errors
2. Review server logs in the terminal
3. Ensure all files are present and unchanged
4. Try the quick-start scripts for automated setup

---

**Happy investigating!** 🕵️‍♀️ 