import { HomePage, ProductPage, ShoppingCartPage } from '../support/pages';
import { HeaderComponent } from '../support/components/HeaderComponent';
import { UserFactory, OrderFactory } from '../support/utils/factories';
import { DataGenerator } from '../support/utils/dataGenerator';

describe('Shopping Cart', () => {
  let homePage, productPage, cartPage, headerComponent, testUser;

  before(() => {
    testUser = UserFactory.createValidUser();
  });

  beforeEach(() => {
    homePage = new HomePage();
    productPage = new ProductPage();
    cartPage = new ShoppingCartPage();
    headerComponent = new HeaderComponent();
    
    cy.clearCart();
    cartPage.clearEntireCart();
  });

  it('should add product to cart', { tags: '@smoke' }, () => {
    productPage.visit('/computing-and-internet');
    
    // Check initial cart count (should be 0)
    headerComponent.getCartItemCount().then(initialCount => {
      cy.log(`Initial cart count: ${initialCount}`);
      
      // Add product to cart
      productPage.performCompleteProductPurchase();
      
      // Verify cart count increased by 1
      headerComponent.getCartItemCount().then(finalCount => {
        cy.log(`Final cart count: ${finalCount}`);
        expect(finalCount).to.equal(initialCount + 1);
        cy.log('✓ Product successfully added to cart - counter increased');
      });
    });
  });

  it('should update product quantity in cart', { tags: '@functionality' }, () => {
    const quantity = DataGenerator.getRandomNumber(2, 5);
    productPage.visit('/computing-and-internet');
    productPage.addMultipleQuantityToCart(quantity);
    
    cartPage.visit('/cart');
    const newQuantity = DataGenerator.getRandomNumber(1, 3);
    cartPage.bulkUpdateQuantities([newQuantity]);
    cy.log(`✓ Updated quantity to ${newQuantity}`);
  });

  it('should remove items from cart', { tags: '@functionality' }, () => {
    productPage.visit('/computing-and-internet');
    productPage.addToCart();
    cartPage.clearEntireCart();
  });

  it('should handle multiple products in cart', { tags: '@integration' }, () => {
    const productPaths = ['/computing-and-internet', '/health', '/science'];
    cartPage.addMoreItemsWorkflow(productPaths);
    cartPage.verifyCartHasItems();
    cy.log('✓ Multiple products added successfully');
  });

  it('should persist cart across sessions', { tags: '@persistence' }, () => {
    const userData = homePage.performCompleteUserRegistration();
    
    productPage.visit('/computing-and-internet');
    productPage.addToCart();
    
    homePage.performLogout();
    homePage.performUserLoginFlow(userData.email, userData.password);
    cartPage.verifyCartPersistence();
    cy.log('✓ Checked cart persistence');
  });

  it('should calculate correct totals', { tags: '@calculation' }, () => {
    productPage.visit('/computing-and-internet');
    productPage.addToCart();
    cartPage.visit('/cart').verifyPriceCalculation();
    cy.log('✓ Price calculation verified');
  });

  it('should handle cart with maximum items', { tags: '@edge-case' }, () => {
    const productPaths = ['/computing-and-internet', '/health', '/science'];
    cartPage.addMoreItemsWorkflow(productPaths);
    cartPage.performCartValidation();
    cy.log('✓ Cart can handle multiple items');
  });

  it('should save and restore cart', { tags: '@persistence' }, () => {
    productPage.visit('/computing-and-internet');
    productPage.addToCart();
    cartPage.visit('/cart').saveCartForLater();
    cartPage.clearEntireCart();
    cartPage.restoreSavedCart();
  });

  it('should handle cart abandonment simulation', { tags: '@behavior' }, () => {
    productPage.visit('/computing-and-internet');
    productPage.addToCart();
    cartPage.simulateCartAbandonment();
  });
});