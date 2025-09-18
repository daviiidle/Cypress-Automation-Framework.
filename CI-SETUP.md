# GitHub Actions CI Setup for Cypress Tests

## Quick Setup Steps

### 1. Push to GitHub Repository

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial Cypress automation framework"

# Add GitHub remote and push
git remote add origin https://github.com/your-username/cypress-automation-framework.git
git branch -M main
git push -u origin main
```

### 2. GitHub Actions Will Run Automatically

Once you push, the workflow will trigger on:
- **Push** to `main` or `develop` branches
- **Pull requests** to `main` or `develop` branches  
- **Daily schedule** at 2 AM UTC
- **Manual trigger** from GitHub Actions tab

## Workflow Overview

### Jobs That Run:

1. **cypress-run** (Matrix job)
   - Runs on: Chrome, Edge, Firefox
   - Executes all E2E tests
   - Uploads screenshots/videos on failure
   - Retries failed tests 2x

2. **smoke-tests**  
   - Runs only tests tagged with `@smoke`
   - Fast feedback loop
   - Uses Chrome browser

3. **generate-report**
   - Consolidates all test artifacts
   - Creates summary report
   - Runs after all tests complete

## Available npm Scripts for CI

```bash
# Install and verify Cypress for CI
npm run ci:install
npm run ci:verify

# Run tests with CI configuration
npm run ci:test              # All tests
npm run ci:smoke            # Smoke tests only
npm run ci:regression       # Regression tests only

# Browser-specific CI runs
npm run ci:test:chrome      # Chrome only
npm run ci:test:firefox     # Firefox only  
npm run ci:test:edge        # Edge only

# Generate reports
npm run ci:report           # Merge and generate HTML reports

# Cleanup
npm run ci:cleanup          # Clear screenshots/videos/reports
```

## Configuration Files

- **`.github/workflows/cypress-tests.yml`** - Main GitHub Actions workflow
- **`cypress.ci.config.js`** - CI-optimized Cypress configuration
- **`package.json`** - Updated with CI-specific scripts

## Viewing Results

### In GitHub Actions:
1. Go to your repository on GitHub
2. Click "Actions" tab  
3. Click on any workflow run
4. View job results, logs, and artifacts

### Artifacts Available:
- **Screenshots** (on test failures)
- **Videos** (all test runs)
- **Test Reports** (HTML/JSON format)
- **Summary Report** (consolidated results)

## Environment Variables

The CI workflow uses these environment variables:
- `CYPRESS_baseUrl`: https://demowebshop.tricentis.com
- `CYPRESS_viewportWidth`: 1280
- `CYPRESS_viewportHeight`: 720

## Test Tags Usage

Tests are organized with tags for different CI scenarios:

```javascript
// Smoke tests (run quickly for fast feedback)
it('should load homepage', { tags: '@smoke' }, () => {
  // test code
});

// Regression tests (comprehensive testing)  
it('should handle complex workflow', { tags: '@regression' }, () => {
  // test code
});

// Run specific tags in CI:
// npm run ci:smoke      - Only @smoke tests
// npm run ci:regression - Only @regression tests
```

## Monitoring and Notifications

### GitHub Notifications:
- Failed workflows notify via GitHub notifications
- Pull request checks show test status
- Repository admins get email notifications

### Adding Slack/Teams Notifications (Optional):
Add to workflow file:
```yaml
- name: Notify Slack on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Troubleshooting CI Issues

### Common Issues:

1. **Tests fail in CI but pass locally**
   - Check viewport size differences
   - Verify network/timing issues
   - Review CI logs for specific errors

2. **Browser crashes in CI**
   - Already configured with `--no-sandbox --disable-dev-shm-usage`
   - Uses headless mode for stability

3. **Flaky tests**
   - CI retries failed tests 2 times
   - Consider adding wait times or better selectors

### Debug CI Issues:
```bash
# Run locally with CI config
npm run ci:test

# Run specific browser that failed in CI  
npm run ci:test:chrome
```

## Performance Optimization

The CI setup includes:
- **Parallel execution** across 3 browsers
- **Test retries** for flaky tests  
- **Artifact cleanup** to save space
- **Optimized browser launch** arguments
- **Test isolation** for consistency

## Security Considerations

- No secrets required for public demo site
- Uses official Cypress GitHub Action
- Artifacts auto-expire (30 days max)
- Only runs on trusted branches

## Next Steps

1. **Push your code** to GitHub
2. **Check Actions tab** for first workflow run
3. **Review artifacts** and reports
4. **Add more test tags** as needed
5. **Customize notification** preferences
6. **Schedule additional runs** if needed

The CI pipeline will provide comprehensive test coverage across multiple browsers with detailed reporting and artifact collection!