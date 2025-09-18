import { HomePage } from '../support/pages';
import { UserFactory } from '../support/utils/factories';
import { DataGenerator } from '../support/utils/dataGenerator';

describe('Basic Functionality Tests', () => {
  let homePage;

  beforeEach(() => {
    homePage = new HomePage();
    homePage.visit();
  });

  it('should navigate to key pages', { tags: '@smoke' }, () => {
    homePage.visit().verifyHomePage();
    homePage.navigateToRegister();
    homePage.navigateToLogin();
  });

  it('should demonstrate Faker data generation', { tags: '@faker' }, () => {
    const user1 = DataGenerator.generateUser();
    const user2 = DataGenerator.generateUser();
    
    cy.log('User 1:', user1);
    cy.log('User 2:', user2);
    
    // Verify data is unique and realistic
    expect(user1.email).to.not.equal(user2.email);
    expect(user1.firstName).to.not.equal(user2.firstName);
    expect(user1.email).to.include('@');
    expect(['Male', 'Female']).to.include(user1.gender);
  });

  it('should show search functionality', { tags: '@search' }, () => {
    const searchTerm = DataGenerator.generateSearchTerm();
    homePage.visit().verifySearchFunctionality(searchTerm);
    cy.log(`✓ Search executed for: ${searchTerm}`);
  });

  it('should verify homepage elements', { tags: '@smoke' }, () => {
    homePage.visit();
    homePage.verifyHomePage();
    homePage.verifyNavigationMenu();
    homePage.verifyFeaturedProducts();
    
    const searchTerm = DataGenerator.generateSearchTerm();
    homePage.searchProduct(searchTerm);
    cy.log(`✓ Successfully entered search term: ${searchTerm}`);
  });
});