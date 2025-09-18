class EnvironmentConfig {
  constructor() {
    this.config = this.getConfig();
  }

  getConfig() {
    // Detect if we're running in CI environment
    const isCI = Cypress.env('CI') === true || Cypress.env('CI') === 'true' || process.env.CI === 'true';
    
    // Helper function to get environment variable with fallback
    const getEnvVar = (key, fallback, ciOverride = null) => {
      // If in CI and there's a specific CI override, use it
      if (isCI && ciOverride !== null) {
        return ciOverride;
      }
      
      // Try with CYPRESS_ prefix first (for CI/GitHub Actions)
      const cypressValue = Cypress.env(key);
      if (cypressValue !== undefined) {
        return cypressValue;
      }
      
      // Try without prefix (for local development)
      const directValue = Cypress.env(key.replace('CYPRESS_', ''));
      if (directValue !== undefined) {
        return directValue;
      }
      
      return fallback;
    };

    return {
      baseUrl: getEnvVar('BASE_URL', 'https://demowebshop.tricentis.com'),
      timeout: {
        default: parseInt(getEnvVar('DEFAULT_COMMAND_TIMEOUT', '10000')),
        request: parseInt(getEnvVar('REQUEST_TIMEOUT', '10000')),
        response: parseInt(getEnvVar('RESPONSE_TIMEOUT', '10000'))
      },
      viewport: {
        width: parseInt(getEnvVar('VIEWPORT_WIDTH', '1280')),
        height: parseInt(getEnvVar('VIEWPORT_HEIGHT', '720'))
      },
      browser: {
        name: getEnvVar('BROWSER', 'chrome'),
        // Force headless mode in CI, use environment variable for local
        headless: getEnvVar('HEADLESS', 'false', isCI ? 'true' : null) === 'true'
      },
      reporting: {
        video: getEnvVar('VIDEO', 'true') !== 'false',
        screenshots: getEnvVar('SCREENSHOTS', 'true') !== 'false',
        reporter: getEnvVar('REPORTER', 'cypress-mochawesome-reporter')
      },
      testData: {
        defaultEmail: getEnvVar('TEST_USER_EMAIL', 'test@example.com'),
        defaultPassword: getEnvVar('TEST_USER_PASSWORD', 'Test123!')
      },
      isCI: isCI
    };
  }

  get baseUrl() {
    return this.config.baseUrl;
  }

  get timeout() {
    return this.config.timeout;
  }

  get viewport() {
    return this.config.viewport;
  }

  get browser() {
    return this.config.browser;
  }

  get reporting() {
    return this.config.reporting;
  }

  get testData() {
    return this.config.testData;
  }
}

export default new EnvironmentConfig();