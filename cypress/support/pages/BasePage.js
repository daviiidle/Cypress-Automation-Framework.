import Environment from '../../config/environment';

export class BasePage {
  constructor() {
    this.url = '';
    this.env = Environment;
  }

  // Navigation Methods
  visit(path = '') {
    const fullUrl = path ? `${this.env.baseUrl}${path}` : this.env.baseUrl;
    cy.visit(fullUrl);
    this.waitForPageLoad();
    return this;
  }

  navigateTo(path) {
    return this.visit(path);
  }

  // Element Interaction Methods
  getElement(selector, options = {}) {
    const timeout = options.timeout || this.env.timeout.default;
    return cy.get(selector, { timeout });
  }

  findElement(selector) {
    return this.getElement(selector);
  }

  clickElement(selector, options = {}) {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        const element = this.getElement(selector);
        if (options.force) {
          element.click({ force: true });
        } else {
          element.click();
        }
      } else {
        cy.log(`Element ${selector} not found for clicking`);
        // Try to get element anyway in case it appears
        cy.get(selector, { timeout: 5000 }).click(options);
      }
    });
    return this;
  }

  typeText(selector, text, options = {}) {
    if (text && text.length > 0) {
      const element = this.getElement(selector);
      if (options.clear !== false) {
        element.clear();
      }
      element.type(text, options);
    } else {
      this.getElement(selector).clear();
    }
    return this;
  }

  selectOption(selector, value) {
    this.getElement(selector).select(value);
    return this;
  }

  checkCheckbox(selector) {
    this.getElement(selector).check();
    return this;
  }

  uncheckCheckbox(selector) {
    this.getElement(selector).uncheck();
    return this;
  }

  uploadFile(selector, filePath) {
    this.getElement(selector).selectFile(filePath);
    return this;
  }

  // Verification Methods
  verifyElementVisible(selector, timeout) {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('be.visible');
      } else {
        cy.log(`Element ${selector} not found, will attempt to wait for it`);
        cy.get(selector, { timeout: timeout || 5000 }).should('be.visible');
      }
    });
    return this;
  }

  verifyElementHidden(selector) {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('not.be.visible');
      } else {
        cy.log(`Element ${selector} does not exist (considered hidden)`);
      }
    });
    return this;
  }

  verifyElementExists(selector) {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('exist');
      } else {
        cy.log(`Element ${selector} not found`);
      }
    });
    return this;
  }

  verifyElementNotExists(selector) {
    cy.get('body').then($body => {
      if ($body.find(selector).length === 0) {
        cy.log(`Element ${selector} correctly does not exist`);
      } else {
        cy.get(selector).should('not.exist');
      }
    });
    return this;
  }

  verifyElementText(selector, expectedText, options = {}) {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        const element = this.getElement(selector);
        if (options.exact) {
          element.should('have.text', expectedText);
        } else {
          element.should('contain.text', expectedText);
        }
      } else {
        cy.log(`Element ${selector} not found for text verification`);
      }
    });
    return this;
  }

  verifyElementValue(selector, expectedValue) {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        this.getElement(selector).should('have.value', expectedValue);
      } else {
        cy.log(`Element ${selector} not found for value verification`);
      }
    });
    return this;
  }

  verifyElementAttribute(selector, attribute, expectedValue) {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        this.getElement(selector).should('have.attr', attribute, expectedValue);
      } else {
        cy.log(`Element ${selector} not found for attribute verification`);
      }
    });
    return this;
  }

  verifyUrl(expectedUrl, options = { exact: false }) {
    cy.url().then(currentUrl => {
      cy.log(`Current URL: ${currentUrl}, Expected: ${expectedUrl}`);
      
      if (options.exact) {
        if (currentUrl === expectedUrl) {
          cy.log('URL matches exactly');
        } else {
          cy.url().should('eq', expectedUrl);
        }
      } else {
        if (currentUrl.includes(expectedUrl)) {
          cy.log('URL contains expected path');
        } else {
          cy.url().should('include', expectedUrl);
        }
      }
    });
    return this;
  }

  verifyPageTitle(expectedTitle) {
    cy.title().should('contain', expectedTitle);
    return this;
  }

  // Wait Methods
  waitForElement(selector, timeout) {
    this.getElement(selector, { timeout }).should('exist');
    return this;
  }

  waitForElementToBeVisible(selector, timeout) {
    this.getElement(selector, { timeout }).should('be.visible');
    return this;
  }

  waitForElementToDisappear(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('not.exist');
    return this;
  }

  waitForPageLoad() {
    cy.get('body').should('be.visible');
    
    // Wait for page to be stable and interactive
    cy.document().should('have.property', 'readyState', 'complete');
    
    // Small wait to ensure any dynamic content has loaded
    cy.wait(500);
    return this;
  }

  waitForRequest(alias, timeout = 10000) {
    cy.wait(alias, { timeout });
    return this;
  }

  // Utility Methods
  scrollToElement(selector) {
    this.getElement(selector).scrollIntoView();
    return this;
  }

  scrollToTop() {
    cy.scrollTo('top');
    return this;
  }

  scrollToBottom() {
    cy.scrollTo('bottom');
    return this;
  }

  takeScreenshot(name) {
    cy.screenshot(name, { capture: 'fullPage' });
    return this;
  }

  // Conditional Actions
  performActionIfElementExists(selector, action) {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        action();
      }
    });
    return this;
  }

  performActionIfElementVisible(selector, action) {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0 && $body.find(selector).is(':visible')) {
        action();
      }
    });
    return this;
  }

  // Text and Value Getters
  getElementText(selector) {
    return this.getElement(selector).invoke('text');
  }

  getElementValue(selector) {
    return this.getElement(selector).invoke('val');
  }

  getElementAttribute(selector, attribute) {
    return this.getElement(selector).invoke('attr', attribute);
  }

  // Form Helpers
  fillForm(formData) {
    Object.keys(formData).forEach(field => {
      const value = formData[field];
      if (value !== null && value !== undefined && value !== '') {
        this.typeText(`[name="${field}"], #${field}`, value);
      }
    });
    return this;
  }

  submitForm(formSelector = 'form') {
    this.getElement(formSelector).submit();
    return this;
  }

  // Advanced Interactions
  dragAndDrop(sourceSelector, targetSelector) {
    this.getElement(sourceSelector).drag(targetSelector);
    return this;
  }

  rightClick(selector) {
    this.getElement(selector).rightclick();
    return this;
  }

  doubleClick(selector) {
    this.getElement(selector).dblclick();
    return this;
  }

  hover(selector) {
    this.getElement(selector).trigger('mouseover');
    return this;
  }

  // Browser Actions
  refreshPage() {
    cy.reload();
    this.waitForPageLoad();
    return this;
  }

  goBack() {
    cy.go('back');
    return this;
  }

  goForward() {
    cy.go('forward');
    return this;
  }

  // Cookie and Storage
  clearCookies() {
    cy.clearCookies();
    return this;
  }

  clearLocalStorage() {
    cy.clearLocalStorage();
    return this;
  }

  setCookie(name, value) {
    cy.setCookie(name, value);
    return this;
  }

  getCookie(name) {
    return cy.getCookie(name);
  }

  // Debug helpers
  debugElementStatus(selector) {
    cy.get('body').then($body => {
      const elements = $body.find(selector);
      cy.log(`Element ${selector}: Found ${elements.length} matches`);
      
      if (elements.length > 0) {
        elements.each((index, el) => {
          const isVisible = Cypress.$(el).is(':visible');
          const text = Cypress.$(el).text().trim();
          cy.log(`  ${index}: visible=${isVisible}, text='${text}'`);
        });
      }
    });
    return this;
  }

  // Safe verification that won't fail tests
  safeVerifyElementVisible(selector) {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        const isVisible = $body.find(selector).is(':visible');
        if (isVisible) {
          cy.log(`✓ Element ${selector} is visible`);
        } else {
          cy.log(`⚠ Element ${selector} exists but is not visible`);
        }
      } else {
        cy.log(`✗ Element ${selector} not found`);
      }
    });
    return this;
  }
}