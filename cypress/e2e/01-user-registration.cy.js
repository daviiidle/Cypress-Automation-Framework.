import { HomePage, RegisterPage } from '../support/pages';
import { UserFactory } from '../support/utils/factories';
import { DataGenerator } from '../support/utils/dataGenerator';

describe('User Registration', () => {
  let homePage, registerPage;

  beforeEach(() => {
    homePage = new HomePage();
    registerPage = new RegisterPage();
  });

  it('should register a new user with valid data', { tags: '@smoke' }, () => {
    const userData = registerPage.registerNewUser();
    cy.log('Registered user:', userData);
  });

  it('should show validation errors for invalid email', { tags: '@validation' }, () => {
    const invalidUser = UserFactory.createUserWithInvalidEmail();
    registerPage
      .registerWithInvalidData(invalidUser)
      .verifyEmailFormat();
  });

  it('should reject short passwords', { tags: '@validation' }, () => {
    const userData = UserFactory.createUserWithShortPassword();
    registerPage
      .registerWithInvalidData(userData)
      .logValidationError()
      .verifyPasswordRequirements();
  });

  it('should reject mismatched passwords', { tags: '@validation' }, () => {
    const userData = UserFactory.createUserWithMismatchedPasswords();
    registerPage
      .registerWithInvalidData(userData)
      .verifyValidationErrors();
  });

  it('should handle multiple user registrations', { tags: '@data-driven' }, () => {
    const users = UserFactory.createMultipleUsers(3);
    
    users.forEach((userData, index) => {
      cy.log(`Registering user ${index + 1}: ${userData.email}`);
      registerPage.registerNewUser(userData);
      cy.clearCookies();
    });
  });

  it('should generate unique data for each test run', { tags: '@faker' }, () => {
    const user1 = DataGenerator.generateUser();
    const user2 = DataGenerator.generateUser();
    
    expect(user1.email).to.not.equal(user2.email);
    expect(user1.firstName).to.not.equal(user2.firstName);
    
    cy.log('User 1:', user1);
    cy.log('User 2:', user2);
    
    // Verify data realism
    expect(user1.email).to.include('@');
    expect(user1.firstName).to.have.length.greaterThan(1);
    expect(['Male', 'Female']).to.include(user1.gender);
  });

  it('should require all mandatory fields', { tags: '@validation' }, () => {
    registerPage
      .visit('/register')
      .verifyRequiredFields();
  });

  it('should clear form fields properly', { tags: '@functionality' }, () => {
    registerPage
      .visit('/register')
      .fillPartialRegistration(UserFactory.createValidUser())
      .clearAllFields()
      .verifyFieldsAreEmpty();
  });
});