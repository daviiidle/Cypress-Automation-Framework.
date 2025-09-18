// Ultra basic test to verify Cypress works in CI
describe('Basic CI Test', () => {
  it('should load the demo website', () => {
    cy.visit('https://demowebshop.tricentis.com');
    cy.get('body').should('be.visible');
    cy.title().should('contain', 'Demo Web Shop');
    cy.log('✓ Basic test passed - Cypress is working in CI');
  });
});