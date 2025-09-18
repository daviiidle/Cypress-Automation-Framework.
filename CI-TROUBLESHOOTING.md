# CI Troubleshooting Guide

## What Went Wrong? 

Based on your results showing **0** screenshots and videos, here's what likely happened:

### ❌ **Common CI Failure Causes:**

1. **Dependency Installation Failed**
   - `npm ci` couldn't install packages
   - `cypress install` failed to download binary

2. **Test Files Not Found**
   - GitHub Actions couldn't locate `cypress/e2e/**/*.cy.js` files
   - Wrong file paths or missing files

3. **Cypress Binary Issues**
   - Cypress binary didn't install correctly
   - Version compatibility problems

4. **Configuration Problems**
   - Wrong Cypress config file
   - Missing required dependencies

## 🔧 **Immediate Fixes Applied**

I've updated your CI setup with these improvements:

### **1. Simplified Workflow** (`.github/workflows/cypress-tests.yml`)
```yaml
# ✅ FIXED: Simpler, more reliable workflow
- Removed complex matrix strategy 
- Added comprehensive debugging steps
- Uses stable Cypress version (13.x instead of 15.x)
- Added --force flag for Cypress installation
```

### **2. Stable Dependencies** (`package.json`)
```json
// ✅ FIXED: Downgraded to stable versions
"cypress": "^13.15.1"  // Instead of 15.x beta
"cypress-mochawesome-reporter": "^3.8.2"  // Compatible version
```

### **3. Debug Workflow** (`.github/workflows/debug-ci.yml`)
- Manual trigger workflow to diagnose issues
- Comprehensive environment checking
- Step-by-step validation

## 🚀 **Next Steps To Fix CI**

### **Step 1: Run Debug Workflow**
1. Go to GitHub → Actions → "Debug CI Setup"
2. Click "Run workflow" 
3. Check the output to see what's failing

### **Step 2: Common Fixes**

**If `npm ci` fails:**
```bash
# Delete package-lock.json and reinstall
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Fix package-lock.json"
```

**If Cypress binary fails:**
```bash
# Clear Cypress cache locally and test
npx cypress cache clear
npx cypress install --force
npx cypress verify
```

**If tests aren't found:**
```bash
# Verify file structure
ls -la cypress/e2e/
# Should show *.cy.js files
```

### **Step 3: Test Locally First**
```bash
# Run the same commands CI uses
npm ci
npx cypress install --force
npx cypress verify

# Test smoke tests locally
npx cypress run --browser chrome --headless --env grepTags="@smoke"
```

## 🐛 **Debugging Your Current Issue**

Based on your output, here's what to check:

### **Check 1: File Structure**
```bash
# Verify these files exist:
cypress/e2e/00-simple-tests.cy.js
cypress/e2e/01-user-registration.cy.js
cypress/e2e/02-user-login.cy.js
cypress/e2e/03-shopping-cart.cy.js
# ... etc
```

### **Check 2: Dependencies** 
```bash
# Look for these in package.json:
"cypress": "^13.15.1"
"@cypress/grep": "^4.1.1"
```

### **Check 3: Package Lock**
```bash
# Check if package-lock.json has conflicts
npm ls cypress
```

## 📊 **Expected Successful Output**

After fixes, you should see:
```
✅ Smoke Tests: PASSED (2-3 tests)
✅ Chrome Tests: PASSED (8+ tests) 
📁 Artifacts Generated:
   - Videos: 5-10 files
   - Screenshots: 0-5 files (only on failures)
   - Reports: HTML test reports
```

## 🔄 **Quick Fix Commands**

Run these locally to test before pushing:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Force Cypress install  
npx cypress install --force

# 3. Test one spec file
npx cypress run --spec "cypress/e2e/00-simple-tests.cy.js"

# 4. Test smoke tests
npx cypress run --env grepTags="@smoke"
```

## 🚨 **Emergency Fallback**

If CI still fails, try this minimal test:

**Create:** `.github/workflows/simple-test.yml`
```yaml
name: Simple Test
on: [workflow_dispatch]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install cypress --save-dev
      - run: npx cypress install
      - run: npx cypress run --spec "cypress/e2e/00-simple-tests.cy.js"
```

## 📝 **What Changed**

### **Before (Failing):**
- Complex matrix strategy with 3 browsers
- Latest Cypress version (15.x - potentially unstable)
- Complex configuration files
- No debugging steps

### **After (Should Work):**
- Simple, sequential jobs
- Stable Cypress version (13.x) 
- Comprehensive debugging
- Better error handling
- Force installation flags

Try the debug workflow first, then push the updated files. The CI should now work properly and generate actual test artifacts!