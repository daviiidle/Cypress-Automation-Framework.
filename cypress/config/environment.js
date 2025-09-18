class EnvironmentConfig {
  constructor() {
    this.config = this.getConfig();
  }

  getConfig() {
    return {
      baseUrl: Cypress.env('BASE_URL') || 'https://demowebshop.tricentis.com',
      timeout: {
        default: Cypress.env('DEFAULT_COMMAND_TIMEOUT') || 10000,
        request: Cypress.env('REQUEST_TIMEOUT') || 10000,
        response: Cypress.env('RESPONSE_TIMEOUT') || 10000
      },
      viewport: {
        width: Cypress.env('VIEWPORT_WIDTH') || 1280,
        height: Cypress.env('VIEWPORT_HEIGHT') || 720
      },
      browser: {
        name: Cypress.env('BROWSER') || 'chrome',
        headless: Cypress.env('HEADLESS') === 'true'
      },
      reporting: {
        video: Cypress.env('VIDEO') !== 'false',
        screenshots: Cypress.env('SCREENSHOTS') !== 'false',
        reporter: Cypress.env('REPORTER') || 'cypress-mochawesome-reporter'
      },
      testData: {
        defaultEmail: Cypress.env('TEST_USER_EMAIL') || 'test@example.com',
        defaultPassword: Cypress.env('TEST_USER_PASSWORD') || 'Test123!'
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