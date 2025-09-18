# Windows PowerShell Setup Guide

## 🔍 WSL + Windows PowerShell Setup

**Your setup:** Windows machine using WSL for development, but running tests in Windows PowerShell.

**Key issue:** Cypress binary needs to be installed separately for Windows and WSL.

## 🚨 Common Issue: 'cypress' is not recognized

If you see this error in PowerShell:
```
'cypress' is not recognized as an internal or external command,
operable program or batch file.
```

Or this error:
```
No version of Cypress is installed in: C:\Users\D\AppData\Local\Cypress\Cache\15.2.0\Cypress
```

## ✅ Solutions

### **Option 1: Use npm scripts (Recommended)**
```powershell
# These now use direct node calls
npm run cy:open
npm run cy:run
npm run test:smoke
npm run cypress:verify
```

### **Option 2: Use node directly**
```powershell
node node_modules/cypress/bin/cypress open
node node_modules/cypress/bin/cypress run
node node_modules/cypress/bin/cypress verify
```

### **Option 3: Use Windows batch file**
```powershell
# We created a cypress.cmd file for you
.\cypress.cmd open
.\cypress.cmd run
.\cypress.cmd verify
```

### **Option 4: Install globally (if preferred)**
```powershell
npm install -g cypress
cypress open
```

## 🔧 PowerShell Execution Policy

If you get execution policy errors, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🎯 Verification Commands

Check if Cypress is properly installed:
```powershell
npm run cypress:verify
npm run cypress:info
npm run cypress:cache
npm run windows:setup  # Check Node.js version and platform
```

Test the solutions:
```powershell
# Method 1: npm scripts
npm run cy:open

# Method 2: Direct node call
node node_modules/cypress/bin/cypress open

# Method 3: Windows batch file
.\cypress.cmd open
```

## 🚀 Quick Start for WSL + Windows Setup

1. **Open PowerShell** in project directory
2. **Check setup:**
   ```powershell
   npm run windows:setup
   # Should show: Platform: win32
   ```
3. **Dependencies already installed** (via WSL)
4. **Install Cypress binary for Windows:**
   ```powershell
   npm run cypress:install
   # This downloads Cypress.exe to Windows cache
   ```
5. **Verify installation:**
   ```powershell
   npm run cypress:verify
   ```
6. **Open Cypress:**
   ```powershell
   npm run cy:open
   ```

## 🐛 Troubleshooting

### Issue: npm ERR! code ENOENT
**Solution:** Make sure you're in the correct directory:
```powershell
cd "C:\Users\D\Cypress Automation framework"
pwd  # Should show your project directory
```

### Issue: Cypress binary not found
**Solution:** Install Cypress binary for Windows:
```powershell
# First try normal install
npm run cypress:install

# If that doesn't work, force reinstall
npm run cypress:install:force

# Then verify
npm run cypress:verify
```

**Alternative:** Clear cache and reinstall:
```powershell
node node_modules/cypress/bin/cypress cache clear
npm install cypress --force
npm run cypress:install
```

### Issue: WSL/Ubuntu missing dependencies
**Solution:** If using WSL, run this in WSL terminal:
```bash
./install-cypress-deps.sh
```

### Issue: Node.js not found
**Solution:** Ensure Node.js is installed and in PATH:
```powershell
node --version
npm --version
```
If not installed, download from https://nodejs.org

### Issue: Permission denied
**Solution:** Run PowerShell as Administrator or change execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

## 📋 Windows-Specific Commands

```powershell
# Check Node.js version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Clear npm cache
npm cache clean --force

# Reinstall node_modules
Remove-Item -Recurse -Force node_modules
npm install
```

## 🎨 PowerShell Aliases (Optional)

Add to your PowerShell profile for convenience:
```powershell
# Open PowerShell profile
notepad $PROFILE

# Add these aliases:
Set-Alias -Name cyopen -Value "npm run cy:open"
Set-Alias -Name cyrun -Value "npm run cy:run"
Set-Alias -Name cysmoke -Value "npm run test:smoke"
```

Then use:
```powershell
cyopen    # Opens Cypress
cyrun     # Runs tests
cysmoke   # Runs smoke tests
```