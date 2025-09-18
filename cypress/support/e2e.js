import '@cypress/grep';
import 'cypress-mochawesome-reporter/register';
import 'cypress-real-events/support';
import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

beforeEach(() => {
  cy.viewport(1280, 720);
});