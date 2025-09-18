import { UserFactory, AddressFactory, PaymentFactory, OrderFactory, TestDataFactory } from '../support/utils/factories';
import { DataGenerator } from '../support/utils/dataGenerator';
import { HomePage, RegisterPage, LoginPage, ProductPage } from '../support/pages';

describe('Faker Data Generation Showcase', () => {
  let homePage, registerPage, loginPage, productPage;

  beforeEach(() => {
    homePage = new HomePage();
    registerPage = new RegisterPage();
    loginPage = new LoginPage();
    productPage = new ProductPage();
  });
  
  it('should demonstrate user data generation', { tags: '@faker' }, () => {
    cy.log('=== USER DATA GENERATION ===');
    
    // Generate single user
    const user = DataGenerator.generateUser();
    cy.log('Generated user:', user);
    
    // Verify data structure and realism
    expect(user.email).to.include('@');
    expect(user.firstName).to.have.length.greaterThan(1);
    expect(user.lastName).to.have.length.greaterThan(1);
    expect(['Male', 'Female']).to.include(user.gender);
    expect(user.password).to.equal('Test123!');
    expect(user.confirmPassword).to.equal(user.password);
    
    // Generate multiple users
    const users = UserFactory.createMultipleUsers(5);
    cy.log('Generated 5 users:', users);
    
    // Verify uniqueness
    const emails = users.map(u => u.email);
    const uniqueEmails = [...new Set(emails)];
    expect(uniqueEmails).to.have.length(emails.length);
    
    users.forEach((user, index) => {
      cy.log(`User ${index + 1}: ${user.firstName} ${user.lastName} - ${user.email}`);
    });
  });

  it('should demonstrate address generation', { tags: '@faker' }, () => {
    cy.log('=== ADDRESS DATA GENERATION ===');
    
    // Generate billing address
    const billing = AddressFactory.createUSAddress();
    cy.log('Billing address:', billing);
    
    // Generate shipping address  
    const shipping = AddressFactory.createUSAddress();
    cy.log('Shipping address:', shipping);
    
    // Verify addresses are different
    expect(billing.city).to.not.equal(shipping.city);
    
    // Generate matching addresses
    const matching = AddressFactory.createMatchingBillingAndShipping();
    cy.log('Matching addresses:', matching);
    expect(matching.billing.city).to.equal(matching.shipping.city);
    
    // Verify address structure
    expect(billing.address1).to.have.length.greaterThan(3);
    expect(billing.city).to.have.length.greaterThan(2);
    expect(billing.zipCode).to.match(/^\d{5}(-\d{4})?$/);
    expect(billing.email).to.include('@');
  });

  it('should demonstrate payment data generation', { tags: '@faker' }, () => {
    cy.log('=== PAYMENT DATA GENERATION ===');
    
    // Generate valid credit card
    const card = PaymentFactory.createValidCreditCard();
    cy.log('Valid credit card:', card);
    
    // Verify card structure
    expect(card.number).to.have.length.greaterThan(12);
    expect(card.holderName).to.have.length.greaterThan(3);
    expect(parseInt(card.expiryYear)).to.be.greaterThan(new Date().getFullYear());
    expect(card.cvv).to.match(/^\d{3,4}$/);
    
    // Generate expired card
    const expiredCard = PaymentFactory.createExpiredCreditCard();
    cy.log('Expired credit card:', expiredCard);
    expect(parseInt(expiredCard.expiryYear)).to.be.lessThan(new Date().getFullYear() + 1);
    
    // Generate PayPal data
    const paypal = PaymentFactory.createPayPalPayment();
    cy.log('PayPal payment:', paypal);
    expect(paypal.email).to.include('@');
    expect(paypal.type).to.equal('paypal');
  });

  it('should demonstrate complete order generation', { tags: '@faker' }, () => {
    cy.log('=== COMPLETE ORDER GENERATION ===');
    
    // Generate simple order
    const order = OrderFactory.createSimpleOrder();
    cy.log('Simple order:', order);
    
    // Verify order structure
    expect(order.billingAddress).to.exist;
    expect(order.shippingAddress).to.exist;
    expect(order.paymentMethod).to.exist;
    expect(['Ground', 'Next Day Air', '2nd Day Air']).to.include(order.shippingMethod);
    
    // Test order with actual registration
    const registeredUser = registerPage.registerNewUser();
    cy.log('Order for registered user:', registeredUser);
    expect(registeredUser.email).to.include('@');
    
    homePage.performLogout();
  });

  it('should demonstrate test scenario generation', { tags: '@faker' }, () => {
    cy.log('=== TEST SCENARIO GENERATION ===');
    
    // Test happy path scenario with actual registration
    const happyPath = TestDataFactory.createTestScenario('happy_path');
    cy.log('Happy path scenario:', happyPath);
    
    const user = registerPage.registerNewUser(happyPath.user);
    homePage.performLogout();
    loginPage.loginWithValidCredentials(user);
    
    // Test registration errors scenario
    homePage.performLogout();
    const registrationErrors = TestDataFactory.createTestScenario('registration_errors');
    
    registrationErrors.invalidUsers.slice(0, 2).forEach((invalidUser, index) => {
      cy.log(`Testing invalid user ${index + 1}:`, invalidUser);
      registerPage.registerWithInvalidData(invalidUser).verifyValidationErrors();
    });
  });

  it('should demonstrate seeded vs random data', { tags: '@faker' }, () => {
    cy.log('=== SEEDED VS RANDOM DATA ===');
    
    // Generate random data
    const random1 = DataGenerator.generateUser();
    const random2 = DataGenerator.generateUser();
    cy.log('Random user 1:', random1);
    cy.log('Random user 2:', random2);
    expect(random1.email).to.not.equal(random2.email);
    
    // Generate seeded data
    const seed = 12345;
    DataGenerator.seed(seed);
    const seeded1 = DataGenerator.generateUser();
    
    DataGenerator.seed(seed);
    const seeded2 = DataGenerator.generateUser();
    
    cy.log('Seeded user 1:', seeded1);
    cy.log('Seeded user 2:', seeded2);
    expect(seeded1.email).to.equal(seeded2.email);
    expect(seeded1.firstName).to.equal(seeded2.firstName);
    
    // Reset to random
    DataGenerator.resetSeed();
    const randomAgain = DataGenerator.generateUser();
    cy.log('Random again:', randomAgain);
    expect(randomAgain.email).to.not.equal(seeded1.email);
  });

  it('should demonstrate search term generation', { tags: '@faker' }, () => {
    cy.log('=== SEARCH TERM GENERATION ===');
    
    // Generate and test random search terms
    const searchTerms = Array.from({ length: 5 }, () => DataGenerator.generateSearchTerm());
    cy.log('Generated search terms:', searchTerms);
    
    searchTerms.forEach((term, index) => {
      cy.log(`Testing search term ${index + 1}: "${term}"`);
      expect(['laptop', 'book', 'phone', 'camera', 'watch', 'headphones']).to.include(term);
      
      // Actually test the search functionality
      homePage.performProductSearch(term);
    });
  });

  it('should demonstrate invalid data generation', { tags: '@faker' }, () => {
    cy.log('=== INVALID DATA GENERATION ===');
    
    const invalidData = DataGenerator.generateInvalidData();
    cy.log('Invalid data:', invalidData);
    
    expect(invalidData.invalidEmail).to.not.include('@');
    expect(invalidData.shortPassword).to.have.length.lessThan(6);
    expect(invalidData.emptyString).to.equal('');
    expect(invalidData.longString).to.have.length.greaterThan(50);
    expect(invalidData.specialChars).to.include('!@#$');
    expect(invalidData.sqlInjection).to.include('DROP TABLE');
    expect(invalidData.xssScript).to.include('<script>');
  });

  it('should demonstrate edge case factories', { tags: '@faker' }, () => {
    cy.log('=== EDGE CASE FACTORIES ===');
    
    // Test invalid user data with actual form submission
    const invalidEmail = UserFactory.createUserWithInvalidEmail();
    cy.log('Testing user with invalid email:', invalidEmail);
    registerPage.registerWithInvalidData(invalidEmail).verifyEmailFormat();
    
    const shortPassword = UserFactory.createUserWithShortPassword();
    cy.log('Testing user with short password:', shortPassword);
    registerPage.registerWithInvalidData(shortPassword).verifyPasswordRequirements();
    
    const mismatchedPasswords = UserFactory.createUserWithMismatchedPasswords();
    cy.log('Testing user with mismatched passwords:', mismatchedPasswords);
    registerPage.registerWithInvalidData(mismatchedPasswords).verifyValidationErrors();
  });

  it('should register and test with Faker user end-to-end', { tags: '@e2e' }, () => {
    cy.log('=== END-TO-END TEST WITH FAKER ===');
    
    // Register with Faker data
    const testUser = registerPage.registerNewUser();
    cy.log(`✓ Successfully registered: ${testUser.firstName} ${testUser.lastName}`);
    
    // Logout and login
    homePage.performLogout();
    loginPage.loginWithValidCredentials(testUser);
    cy.log(`✓ Successfully logged in: ${testUser.email}`);
    
    // Search with Faker data and add to cart
    const searchTerm = DataGenerator.generateSearchTerm();
    homePage.verifySearchFunctionality(searchTerm);
    
    // Test product interaction
    productPage.visit('/computing-and-internet');
    productPage.performCompleteProductPurchase();
    cy.log(`✓ Successfully completed end-to-end workflow for: ${testUser.email}`);
  });
});