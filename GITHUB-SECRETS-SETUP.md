# GitHub Secrets Setup Guide

## 🎯 **Problem Identified**

Your CI is failing because environment variables from `.env` file aren't available in GitHub Actions. Here's what I found:

### **Your .env File Contains:**
```bash
CYPRESS_BASE_URL=https://demowebshop.tricentis.com
CYPRESS_VIEWPORT_WIDTH=1280
CYPRESS_VIEWPORT_HEIGHT=720
CYPRESS_DEFAULT_COMMAND_TIMEOUT=10000
CYPRESS_REQUEST_TIMEOUT=10000
CYPRESS_RESPONSE_TIMEOUT=10000
CYPRESS_TEST_USER_EMAIL=test@example.com
CYPRESS_TEST_USER_PASSWORD=Test123!
CYPRESS_BROWSER=chrome
CYPRESS_HEADLESS=false
CYPRESS_VIDEO=true
CYPRESS_SCREENSHOTS=true
CYPRESS_REPORTER=cypress-mochawesome-reporter
```

### **Your Code Expects:**
Your `cypress/config/environment.js` looks for these variables without the `CYPRESS_` prefix:
- `BASE_URL`
- `DEFAULT_COMMAND_TIMEOUT`
- `TEST_USER_EMAIL`
- etc.

## 🔧 **Solution: GitHub Repository Secrets**

### **Step 1: Access GitHub Secrets**

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### **Step 2: Add These Secrets**

**Non-Sensitive Configuration** (Repository Variables):
```
CYPRESS_BASE_URL = https://demowebshop.tricentis.com
CYPRESS_VIEWPORT_WIDTH = 1280
CYPRESS_VIEWPORT_HEIGHT = 720
CYPRESS_DEFAULT_COMMAND_TIMEOUT = 10000
CYPRESS_REQUEST_TIMEOUT = 10000
CYPRESS_RESPONSE_TIMEOUT = 10000
CYPRESS_BROWSER = chrome
CYPRESS_HEADLESS = true
CYPRESS_VIDEO = true
CYPRESS_SCREENSHOTS = true
CYPRESS_REPORTER = cypress-mochawesome-reporter
```

**Sensitive Data** (Repository Secrets):
```
CYPRESS_TEST_USER_EMAIL = test@example.com
CYPRESS_TEST_USER_PASSWORD = Test123!
```

### **Step 3: Secrets vs Variables**

**Use SECRETS for:**
- Passwords
- API keys  
- Sensitive user data
- Database credentials

**Use VARIABLES for:**
- URLs
- Timeouts
- Browser settings
- Non-sensitive configuration

## 📋 **Exact Setup Instructions**

### **Repository Variables** (Settings → Secrets and variables → Actions → Variables tab)

| Name | Value |
|------|-------|
| `CYPRESS_BASE_URL` | `https://demowebshop.tricentis.com` |
| `CYPRESS_VIEWPORT_WIDTH` | `1280` |
| `CYPRESS_VIEWPORT_HEIGHT` | `720` |
| `CYPRESS_DEFAULT_COMMAND_TIMEOUT` | `10000` |
| `CYPRESS_REQUEST_TIMEOUT` | `10000` |
| `CYPRESS_RESPONSE_TIMEOUT` | `10000` |
| `CYPRESS_BROWSER` | `chrome` |
| `CYPRESS_HEADLESS` | `true` |
| `CYPRESS_VIDEO` | `true` |
| `CYPRESS_SCREENSHOTS` | `true` |
| `CYPRESS_REPORTER` | `cypress-mochawesome-reporter` |

### **Repository Secrets** (Settings → Secrets and variables → Actions → Secrets tab)

| Name | Value |
|------|-------|
| `CYPRESS_TEST_USER_EMAIL` | `test@example.com` |
| `CYPRESS_TEST_USER_PASSWORD` | `Test123!` |

## 🔄 **Alternative: Environment-Specific Secrets**

For multiple environments (dev/staging/prod), create environment-specific secrets:

```
DEV_CYPRESS_BASE_URL = https://dev.demowebshop.tricentis.com
STAGING_CYPRESS_BASE_URL = https://staging.demowebshop.tricentis.com
PROD_CYPRESS_BASE_URL = https://demowebshop.tricentis.com
```

## ✅ **Verification Steps**

After setting up secrets:

1. **Check Secrets Page**
   - Go to Settings → Secrets and variables → Actions
   - Verify all secrets/variables are listed

2. **Test in Workflow**
   - The updated CI workflow will log available environment variables
   - Check the debug output for confirmation

3. **Local Testing**
   ```bash
   # Test without .env file to simulate CI
   mv .env .env.backup
   npx cypress run --spec "cypress/e2e/00-simple-tests.cy.js"
   mv .env.backup .env
   ```

## 🚨 **Security Best Practices**

### **DO:**
- Use secrets for passwords and sensitive data
- Use repository variables for configuration
- Keep secrets minimal and specific
- Use environment-specific secrets when needed

### **DON'T:**
- Put secrets in your .env file if it's committed to git
- Use secrets for non-sensitive configuration
- Share secret values in plain text
- Commit .env files with real credentials

## 🔧 **Troubleshooting**

### **Issue: Variables Not Available**
```bash
# Check if variables are being passed correctly
echo "CYPRESS_BASE_URL: $CYPRESS_BASE_URL"
```

### **Issue: Secrets Not Working**
- Verify secret names match exactly (case-sensitive)
- Check if secrets are in "Secrets" tab, not "Variables" tab
- Ensure workflow has access to repository secrets

### **Issue: Tests Still Failing**
- Check that environment.js has proper fallback values
- Verify Cypress configuration maps variables correctly
- Run debug workflow to see actual environment state

## 📝 **Next Steps**

1. ✅ **Set up the secrets/variables** as described above
2. ✅ **The updated CI workflow** will automatically use them
3. ✅ **Run a test** to confirm everything works
4. ✅ **Check the debug output** to verify variables are available

After setup, your CI should generate proper artifacts and test reports!