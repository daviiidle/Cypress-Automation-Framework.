class EnvironmentConfig {
  constructor() {
    this.config = this.getConfig();
  }

  getConfig() {
    // Helper function to get environment variable with fallback
    const getEnvVar = (key, fallback) => {
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
        headless: getEnvVar('HEADLESS', 'false') === 'true'
      },
      reporting: {
        video: getEnvVar('VIDEO', 'true') !== 'false',
        screenshots: getEnvVar('SCREENSHOTS', 'true') !== 'false',
        reporter: getEnvVar('REPORTER', 'cypress-mochawesome-reporter')
      },
      testData: {
        defaultEmail: getEnvVar('TEST_USER_EMAIL', 'test@example.com'),
        defaultPassword: getEnvVar('TEST_USER_PASSWORD', 'Test123!')
      }
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