export class TestHelpers {
  static waitForPageLoad() {
    cy.get('body').should('be.visible');
    cy.get('.ajax-loading-block-window').should('not.exist');
  }

  static takeScreenshot(name) {
    cy.screenshot(name, { capture: 'fullPage' });
  }

  static generateTestId() {
    return Math.random().toString(36).substr(2, 9);
  }

  static scrollToElement(selector) {
    cy.get(selector).scrollIntoView();
  }

  static waitForElement(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('exist');
  }

  static getRandomNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  static cleanEmail(email) {
    return email.toLowerCase().trim();
  }

  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static retry(fn, maxAttempts = 3) {
    let attempts = 0;
    
    function attempt() {
      attempts++;
      try {
        return fn();
      } catch (error) {
        if (attempts >= maxAttempts) {
          throw error;
        }
        cy.wait(1000);
        return attempt();
      }
    }
    
    return attempt();
  }

  // Enhanced business workflow helpers
  static performCompleteUserJourney(userData = null) {
    const { HomePage, RegisterPage, LoginPage } = require('../pages');
    const homePage = new HomePage();
    const registerPage = new RegisterPage();
    const loginPage = new LoginPage();
    
    const user = userData || registerPage.registerNewUser();
    homePage.performLogout();
    loginPage.loginWithValidCredentials(user);
    
    return user;
  }

  static performGuestCheckoutFlow(productUrl = '/computing-and-internet') {
    const { HomePage, ProductPage, ShoppingCartPage } = require('../pages');
    const homePage = new HomePage();
    const productPage = new ProductPage();
    const cartPage = new ShoppingCartPage();
    
    productPage.visit(productUrl);
    productPage.performCompleteProductPurchase();
    cartPage.performCompleteCheckoutFlow();
    
    return 'checkout-complete';
  }

  static simulateReturningCustomer(existingUser) {
    const { HomePage, LoginPage, ProductPage } = require('../pages');
    const homePage = new HomePage();
    const loginPage = new LoginPage();
    const productPage = new ProductPage();
    
    loginPage.loginWithValidCredentials(existingUser);
    productPage.visit('/computing-and-internet');
    productPage.addToCart();
    homePage.checkCartItemCount().then(count => {
      expect(count).to.be.greaterThan(0);
    });
    
    return existingUser;
  }

  static performMultiProductComparison(productUrls = []) {
    const { ProductPage } = require('../pages');
    const productPage = new ProductPage();
    const comparisons = [];
    
    productUrls.forEach(url => {
      productPage.visit(url);
      productPage.compareProductFeatures().then(data => {
        comparisons.push(data);
      });
    });
    
    return cy.wrap(comparisons);
  }

  static performSecurityTestSuite(userData) {
    const { LoginPage, RegisterPage } = require('../pages');
    const loginPage = new LoginPage();
    const registerPage = new RegisterPage();
    
    // Test XSS resistance
    const xssData = {...userData, firstName: '<script>alert("xss")</script>'};
    registerPage.registerWithInvalidData(xssData);
    
    // Test SQL injection resistance
    const sqlData = {...userData, email: "test'; DROP TABLE users; --"};
    loginPage.loginWithInvalidCredentials(sqlData.email, userData.password);
    
    // Test brute force protection
    const invalidPasswords = ['123', 'password', 'admin', '111111'];
    loginPage.performBruteForceTest([userData.email], invalidPasswords);
    
    return 'security-tests-complete';
  }

  static validateFrameworkIntegrity() {
    // Validate all page objects are properly imported
    const pages = require('../pages');
    expect(pages.BasePage).to.exist;
    expect(pages.HomePage).to.exist;
    expect(pages.LoginPage).to.exist;
    expect(pages.RegisterPage).to.exist;
    expect(pages.ProductPage).to.exist;
    expect(pages.ShoppingCartPage).to.exist;
    
    // Validate data generators
    const { DataGenerator } = require('./dataGenerator');
    const testUser = DataGenerator.generateUser();
    expect(testUser.email).to.include('@');
    
    return 'framework-validation-complete';
  }

  static performLoadTestSimulation(userCount = 5) {
    const users = [];
    
    for (let i = 0; i < userCount; i++) {
      const user = this.performCompleteUserJourney();
      users.push(user);
      cy.clearCookies();
    }
    
    return cy.wrap(users);
  }

  static generateTestReport(testResults) {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: testResults.length,
      passed: testResults.filter(r => r.status === 'passed').length,
      failed: testResults.filter(r => r.status === 'failed').length,
      results: testResults
    };
    
    cy.writeFile('cypress/reports/test-report.json', report);
    return report;
  }
}