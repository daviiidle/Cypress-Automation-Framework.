Cypress.Commands.add('login', (email, password) => {
  cy.get('.ico-login').click();
  cy.get('#Email').type(email);
  cy.get('#Password').type(password);
  cy.get('input[value="Log in"]').click();
  cy.url().should('include', '/');
});

Cypress.Commands.add('logout', () => {
  cy.get('.ico-logout').click();
  cy.url().should('include', '/');
});

Cypress.Commands.add('addToCart', (productName) => {
  cy.contains('.product-title', productName).click();
  cy.get('#add-to-cart-button-').click();
  cy.get('.bar-notification').should('be.visible');
});

Cypress.Commands.add('clearCart', () => {
  cy.get('body').then(($body) => {
    // Try different cart selectors
    if ($body.find('#topcartlink').length > 0) {
      cy.get('#topcartlink').click();
    } else if ($body.find('.ico-cart').length > 0) {
      cy.get('.ico-cart').click();
    } else if ($body.text().includes('Shopping cart')) {
      cy.contains('Shopping cart').click();
    } else {
      cy.visit('/cart');
    }
    
    // Clear cart items if any exist
    cy.get('body').then(($cartBody) => {
      if ($cartBody.find('.remove-from-cart').length > 0) {
        cy.get('.remove-from-cart').check({ multiple: true });
        cy.get('input[value="Update shopping cart"]').click();
      } else {
        cy.log('No items in cart to clear');
      }
    });
  });
});

Cypress.Commands.add('waitForElementToBeVisible', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

Cypress.Commands.add('getTestData', (fixture) => {
  return cy.fixture(fixture);
});

Cypress.Commands.add('navigateToCategory', (category) => {
  cy.get('.top-menu a').contains(category).click();
  cy.url().should('include', category.toLowerCase());
});

// Enhanced Business Workflow Commands
Cypress.Commands.add('performCompleteRegistration', (userData = null) => {
  const { RegisterPage } = require('./pages');
  const registerPage = new RegisterPage();
  return registerPage.registerNewUser(userData);
});

Cypress.Commands.add('performQuickLogin', (credentials) => {
  const { LoginPage } = require('./pages');
  const loginPage = new LoginPage();
  return loginPage.performQuickLogin(credentials);
});

Cypress.Commands.add('addProductToCartByUrl', (productUrl) => {
  const { ProductPage } = require('./pages');
  const productPage = new ProductPage();
  productPage.visit(productUrl);
  return productPage.performCompleteProductPurchase();
});

Cypress.Commands.add('performGuestCheckout', (productUrl = '/computing-and-internet') => {
  const { TestHelpers } = require('./utils/helpers');
  return TestHelpers.performGuestCheckoutFlow(productUrl);
});

Cypress.Commands.add('validateUserSession', () => {
  const { HomePage } = require('./pages');
  const homePage = new HomePage();
  return homePage.verifyUserIsLoggedIn();
});

Cypress.Commands.add('performSecurityCheck', (userData) => {
  const { TestHelpers } = require('./utils/helpers');
  return TestHelpers.performSecurityTestSuite(userData);
});

Cypress.Commands.add('compareProducts', (productUrls) => {
  const { TestHelpers } = require('./utils/helpers');
  return TestHelpers.performMultiProductComparison(productUrls);
});

Cypress.Commands.add('simulateUserBehavior', (duration = 5000) => {
  const { HomePage } = require('./pages');
  const homePage = new HomePage();
  return homePage.simulateUserBrowsingBehavior(duration);
});

Cypress.Commands.add('performFrameworkValidation', () => {
  const { TestHelpers } = require('./utils/helpers');
  return TestHelpers.validateFrameworkIntegrity();
});

Cypress.Commands.add('generateDynamicTestData', (type = 'user') => {
  const { DataGenerator } = require('./utils/dataGenerator');
  
  switch (type) {
    case 'user':
      return DataGenerator.generateUser();
    case 'address':
      return DataGenerator.generateAddress();
    case 'order':
      const { OrderFactory } = require('./utils/factories');
      return OrderFactory.createSimpleOrder();
    default:
      return DataGenerator.generateUser();
  }
});

// Advanced Custom Assertions
Cypress.Commands.add('shouldHaveValidEmail', { prevSubject: true }, (subject) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  expect(subject).to.match(emailRegex);
  return cy.wrap(subject);
});

Cypress.Commands.add('shouldBeRealisticName', { prevSubject: true }, (subject) => {
  expect(subject).to.have.length.greaterThan(1);
  expect(subject).to.have.length.lessThan(50);
  expect(subject).to.match(/^[a-zA-Z\s]+$/);
  return cy.wrap(subject);
});

Cypress.Commands.add('shouldBeValidPassword', { prevSubject: true }, (subject) => {
  expect(subject).to.have.length.greaterThan(5);
  expect(subject).to.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/);
  return cy.wrap(subject);
});

// Framework State Management
Cypress.Commands.add('saveTestState', (stateName, data) => {
  cy.window().then(win => {
    win.localStorage.setItem(`testState_${stateName}`, JSON.stringify(data));
  });
});

Cypress.Commands.add('loadTestState', (stateName) => {
  return cy.window().then(win => {
    const state = win.localStorage.getItem(`testState_${stateName}`);
    return state ? JSON.parse(state) : null;
  });
});

Cypress.Commands.add('clearTestStates', () => {
  cy.window().then(win => {
    Object.keys(win.localStorage)
      .filter(key => key.startsWith('testState_'))
      .forEach(key => win.localStorage.removeItem(key));
  });
});