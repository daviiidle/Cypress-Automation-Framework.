# WSL + Windows Development Notes

## 🔍 Current Setup

- **Development Environment**: WSL (Windows Subsystem for Linux)
- **Test Execution**: Windows PowerShell
- **File System**: `/mnt/c/Users/D/Cypress Automation framework/`

## 🎯 Key Understanding

### Why Two Cypress Installations Needed?

1. **WSL Cypress**: 
   - Location: `/home/david/.cache/Cypress/`
   - Used by: Linux commands, development tools
   - Binary: `Cypress` (Linux executable)

2. **Windows Cypress**:
   - Location: `C:\Users\D\AppData\Local\Cypress\Cache\`
   - Used by: Windows PowerShell commands
   - Binary: `Cypress.exe` (Windows executable)

### The Process

```bash
# In WSL (development/setup)
npm install                    # Installs node_modules
# Cypress binary goes to WSL cache

# In Windows PowerShell (testing)
npm run cypress:install        # Downloads Windows Cypress.exe
npm run cy:open               # Uses Windows binary
```

## 🔧 Commands by Environment

### WSL Commands (Development)
```bash
# File operations, code editing
code .
git commit
npm install
```

### Windows PowerShell Commands (Testing)
```powershell
# Test execution
npm run cypress:install
npm run cy:open
npm run cy:run
npm run test:smoke
```

## 📁 Shared File System

Both environments access the same files via:
- **WSL path**: `/mnt/c/Users/D/Cypress Automation framework/`
- **Windows path**: `C:\Users\D\Cypress Automation framework\`

## 🎨 Benefits of This Setup

1. **Development**: Use WSL tools, Git, code editors
2. **Testing**: Use Windows browsers, native performance
3. **Shared**: Same codebase, same node_modules
4. **Flexibility**: Best of both environments

## ⚠️ Important Notes

- Always run `npm run cypress:install` from Windows PowerShell
- Test execution should happen in Windows PowerShell for best performance
- File editing and Git operations can happen in either environment
- Both environments share the same `package.json` and project files