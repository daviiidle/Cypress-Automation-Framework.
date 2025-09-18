import { HomePage, LoginPage, RegisterPage } from '../support/pages';
import { TestDataFactory, UserFactory, PaymentFactory } from '../support/utils/factories';
import { DataGenerator } from '../support/utils/dataGenerator';

describe('Data-Driven Tests with Faker', () => {
  let homePage, loginPage, registerPage;

  beforeEach(() => {
    homePage = new HomePage();
    loginPage = new LoginPage();
    registerPage = new RegisterPage();
  });

  describe('Registration Scenarios', () => {
    const scenarios = ['happy_path', 'registration_errors'];
    
    scenarios.forEach((scenario) => {
      it(`should handle ${scenario.replace('_', ' ')} scenario`, { tags: '@data-driven' }, () => {
        const testData = TestDataFactory.createTestScenario(scenario);
        
        homePage.visit();
        homePage.navigateToRegister();
        
        if (scenario === 'happy_path') {
          registerPage.registerNewUser(testData.user);
        } else if (scenario === 'registration_errors') {
          testData.invalidUsers.forEach((invalidUser, index) => {
            cy.log(`Testing invalid user ${index + 1}:`, invalidUser);
            
            if (index > 0) {
              registerPage.visit('/register');
            } else {
              homePage.visit();
              homePage.navigateToRegister();
            }
            
            registerPage.registerWithInvalidData(invalidUser).verifyValidationErrors();
            
            if (index < testData.invalidUsers.length - 1) {
              cy.clearCookies();
            }
          });
        }
      });
    });
  });

  describe('Payment Method Tests', () => {
    const paymentMethods = ['valid', 'expired', 'invalid'];
    
    paymentMethods.forEach((method) => {
      it(`should test ${method} credit card`, { tags: '@payment' }, () => {
        let cardData;
        
        switch (method) {
          case 'valid':
            cardData = PaymentFactory.createValidCreditCard();
            break;
          case 'expired':
            cardData = PaymentFactory.createExpiredCreditCard();
            break;
          case 'invalid':
            cardData = PaymentFactory.createInvalidCreditCard();
            break;
        }
        
        cy.log(`Testing ${method} card:`, {
          number: cardData.number,
          expiry: `${cardData.expiryMonth}/${cardData.expiryYear}`
        });
        
        expect(cardData.number).to.have.length.greaterThan(12);
        expect(cardData.cvv).to.have.length.greaterThan(2);
        
        if (method === 'valid') {
          expect(parseInt(cardData.expiryYear)).to.be.greaterThan(new Date().getFullYear());
        } else if (method === 'expired') {
          expect(parseInt(cardData.expiryYear)).to.be.lessThan(new Date().getFullYear() + 1);
        }
      });
    });
  });

  describe('Search Functionality', () => {
    it('should test multiple search terms dynamically', { tags: '@search' }, () => {
      cy.fixture('products').then((products) => {
        const testTerms = products.searchTerms;
        
        testTerms.forEach((searchData) => {
          const searchTerm = searchData.term;
          homePage.performProductSearch(searchTerm);
          
          if (searchData.expectedResults) {
            cy.get('.product-item').should('exist');
            cy.log(`✓ Search for "${searchTerm}" returned results`);
          } else {
            cy.get('.search-results').should('contain.text', searchData.expectedMessage);
            cy.log(`✓ Search for "${searchTerm}" showed no results message`);
          }
        });
      });
    });

    it('should generate and test random search terms', { tags: '@random' }, () => {
      const randomTerms = Array.from({ length: 5 }, () => DataGenerator.generateSearchTerm());
      
      randomTerms.forEach((term, index) => {
        cy.log(`Random search ${index + 1}: "${term}"`);
        homePage.performProductSearch(term);
        
        cy.get('body').then(($body) => {
          if ($body.find('.product-item').length > 0) {
            cy.log(`✓ "${term}" found products`);
            cy.get('.product-item').should('exist');
          } else {
            cy.log(`ℹ "${term}" no products found`);
          }
        });
      });
    });
  });

  describe('Bulk User Operations', () => {
    it('should create multiple users with unique data', { tags: '@bulk' }, () => {
      const userCount = 3;
      const users = [];
      
      for (let i = 0; i < userCount; i++) {
        const user = registerPage.registerNewUser();
        users.push(user);
        homePage.performLogout();
        cy.clearCookies();
      }
      
      // Verify all users are unique
      const emails = users.map(u => u.email);
      const uniqueEmails = [...new Set(emails)];
      expect(uniqueEmails).to.have.length(emails.length);
      
      cy.log(`✓ Successfully registered ${userCount} unique users`);
    });
  });

  describe('Faker Consistency Tests', () => {
    it('should generate different data on each run', () => {
      const run1 = {
        user: DataGenerator.generateUser(),
        address: DataGenerator.generateAddress(),
        card: PaymentFactory.createValidCreditCard()
      };
      
      const run2 = {
        user: DataGenerator.generateUser(),
        address: DataGenerator.generateAddress(),
        card: PaymentFactory.createValidCreditCard()
      };
      
      expect(run1.user.email).to.not.equal(run2.user.email);
      expect(run1.address.city).to.not.equal(run2.address.city);
      expect(run1.card.number).to.not.equal(run2.card.number);
      
      cy.log('Data uniqueness verified ✓');
    });

    it('should generate consistent data when seeded', () => {
      const seed = 12345;
      
      DataGenerator.seed(seed);
      const run1 = DataGenerator.generateUser();
      
      DataGenerator.seed(seed);
      const run2 = DataGenerator.generateUser();
      
      expect(run1.email).to.equal(run2.email);
      expect(run1.firstName).to.equal(run2.firstName);
      
      DataGenerator.resetSeed();
      cy.log('Seeded data consistency verified ✓');
    });

    it('should demonstrate end-to-end workflow with multiple users', () => {
      const users = UserFactory.createMultipleUsers(2);
      
      users.forEach((userData, index) => {
        cy.log(`Testing workflow ${index + 1} with user: ${userData.email}`);
        
        // Register user
        const registeredUser = registerPage.registerNewUser(userData);
        
        // Logout and login
        homePage.performLogout();
        loginPage.loginWithValidCredentials(registeredUser);
        
        // Perform some shopping activity
        homePage.performProductSearch('book');
        
        // Clean up for next iteration
        homePage.performLogout();
        cy.clearCookies();
      });
      
      cy.log('✓ Multiple user workflows completed successfully');
    });
  });
});