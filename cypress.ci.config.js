const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demowebshop.tricentis.com',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // CI-optimized settings
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    
    // Timeouts optimized for CI
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    
    // Retry settings for flaky tests
    retries: {
      runMode: 2, // Retry failed tests 2 times in CI
      openMode: 0  // No retries in interactive mode
    },
    
    // Test isolation and cleanup
    testIsolation: true,
    experimentalMemoryManagement: true,
    
    // Reporter configuration for CI
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'mochawesome',
      mochawesomeReporterOptions: {
        reportDir: 'cypress/reports',
        reportFilename: '[status]_[datetime]-[name]-report',
        timestamp: 'longDate',
        quiet: true,
        overwrite: false,
        html: true,
        json: true,
        charts: true
      }
    },
    
    setupNodeEvents(on, config) {
      // Plugin for test tags (grep)
      require('@cypress/grep/src/plugin')(config);
      
      // Task for clearing downloads
      on('task', {
        clearDownloads() {
          const fs = require('fs');
          const path = require('path');
          const downloadFolder = path.join(__dirname, 'cypress', 'downloads');
          
          if (fs.existsSync(downloadFolder)) {
            fs.readdirSync(downloadFolder).forEach((file) => {
              fs.unlinkSync(path.join(downloadFolder, file));
            });
          }
          return null;
        },
        
        // Task for logging in CI
        log(message) {
          console.log(`[CYPRESS CI]: ${message}`);
          return null;
        },
        
        // Task for taking custom screenshots
        takeScreenshot(name) {
          return cy.screenshot(name);
        }
      });
      
      // Browser launch args for CI
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome' || browser.name === 'edge') {
          // Disable web security for testing
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--disable-features=VizDisplayCompositor');
          
          // Performance optimizations for CI
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-gpu');
          
          // Disable unnecessary features
          launchOptions.args.push('--disable-background-timer-throttling');
          launchOptions.args.push('--disable-renderer-backgrounding');
          launchOptions.args.push('--disable-backgrounding-occluded-windows');
        }
        
        return launchOptions;
      });
      
      // Handle failed test screenshots
      on('after:screenshot', (details) => {
        console.log('Screenshot taken:', details.path);
      });
      
      return config;
    },
    
    env: {
      // Environment variables for CI
      timeout: {
        default: 10000,
        long: 20000,
        short: 5000
      },
      
      // Test data for CI
      testUser: {
        email: 'ci-test@example.com',
        password: 'TestPass123!'
      },
      
      // Feature flags
      skipFlaky: false,
      headless: true,
      
      // Grep configuration for test tags
      grepTags: '@smoke @regression',
      grepFilterSpecs: true,
      grepOmitFiltered: true
    }
  },
  
  // Component testing configuration (if needed)
  component: {
    devServer: {
      framework: 'react', // or 'vue', 'angular', etc.
      bundler: 'webpack'
    }
  }
});