import { BasePage } from '../pages/BasePage';

export class HeaderComponent extends BasePage {
  constructor() {
    super();
  }

  // Selectors
  get logo() { return '.header-logo'; }
  get searchBox() { return '#small-searchterms'; }
  get searchButton() { return 'input[value="Search"]'; }
  get navigationMenu() { return '.top-menu'; }
  get cartLink() { return '.header-links a[href="/cart"], #topcartlink, .ico-cart'; }
  get wishlistLink() { return '.ico-wishlist'; }
  get registerLink() { return '.ico-register'; }
  get loginLink() { return '.ico-login, a[href="/login"]'; }
  get logoutLink() { return '.ico-logout'; }
  get accountLink() { return '.ico-account'; }
  get currencySelector() { return '.currency-selector'; }

  // Business Methods
  navigateToHome() {
    this.clickElement(this.logo);
    return this;
  }

  searchForProduct(searchTerm) {
    this.typeText(this.searchBox, searchTerm);
    this.clickElement(this.searchButton);
    return this;
  }

  navigateToCategory(categoryName) {
    cy.get(this.navigationMenu).contains(categoryName).click();
    return this;
  }

  openCart() {
    cy.get('body').then(($body) => {
      if ($body.find('#topcartlink').length > 0) {
        cy.get('#topcartlink').click();
      } else if ($body.find('.ico-cart').length > 0) {
        cy.get('.ico-cart').click();
      } else {
        cy.visit('/cart');
      }
    });
    return this;
  }

  openWishlist() {
    this.clickElement(this.wishlistLink);
    return this;
  }

  navigateToRegister() {
    this.clickElement(this.registerLink);
    return this;
  }

  navigateToLogin() {
    cy.get('body').then(($body) => {
      if ($body.find(this.loginLink).length > 0) {
        this.clickElement(this.loginLink);
      } else {
        cy.contains('Log in').click();
      }
    });
    return this;
  }

  logout() {
    cy.get('body').then(($body) => {
      if ($body.find(this.logoutLink).length > 0) {
        this.clickElement(this.logoutLink);
      } else if ($body.text().includes('Log out')) {
        cy.contains('Log out').click();
      }
    });
    return this;
  }

  openAccount() {
    this.clickElement(this.accountLink);
    return this;
  }

  // State Verification Methods
  verifyUserLoggedIn() {
    cy.get('body').then(($body) => {
      const isLoggedIn = $body.find(this.logoutLink).length > 0 || 
                        $body.text().includes('Log out');
      expect(isLoggedIn).to.be.true;
    });
    return this;
  }

  verifyUserLoggedOut() {
    cy.get('body').then(($body) => {
      const isLoggedOut = $body.find(this.loginLink).length > 0 || 
                         $body.text().includes('Log in');
      expect(isLoggedOut).to.be.true;
    });
    return this;
  }

  getCartItemCount() {
    return cy.get('body').then($body => {
      cy.log('=== Cart Counter Debug ===');
      
      let count = 0;
      
      // Strategy 1: Look specifically for "Shopping cart" link in header
      const headerLinks = $body.find('.header-links a, .header a, header a');
      cy.log(`Checking ${headerLinks.length} header links for cart`);
      
      headerLinks.each((i, el) => {
        const text = Cypress.$(el).text().trim();
        const href = el.href || '';
        
        if (href.includes('/cart') || text.toLowerCase().includes('shopping cart')) {
          cy.log(`Cart link ${i}: "${text}" (href: ${href})`);
          
          // Look for exact pattern "Shopping cart (number)"
          const match = text.match(/^shopping cart\s*\((\d+)\)$/i);
          if (match && count === 0) {
            count = parseInt(match[1]);
            cy.log(`✓ Found exact cart count: ${count}`);
            return false; // Break out of each loop
          }
        }
      });
      
      // Strategy 2: If not found, look more broadly but be very specific
      if (count === 0) {
        $body.find('*').each((index, el) => {
          const text = Cypress.$(el).text().trim();
          
          // Only match if it's exactly "Shopping cart (number)" - no extra text
          if (text.match(/^shopping cart\s*\(\d+\)$/i)) {
            const match = text.match(/^shopping cart\s*\((\d+)\)$/i);
            if (match && count === 0) {
              count = parseInt(match[1]);
              cy.log(`✓ Found cart count in element: ${count} from "${text}"`);
              return false; // Break out of each loop
            }
          }
        });
      }
      
      // Strategy 3: Last resort - look for cart link and extract just the number
      if (count === 0) {
        const allCartLinks = $body.find('a[href="/cart"]');
        allCartLinks.each((i, el) => {
          const text = Cypress.$(el).text().trim();
          cy.log(`Checking cart link: "${text}"`);
          
          // Extract just the last number in parentheses from cart-related text
          if (text.toLowerCase().includes('cart')) {
            const numbers = text.match(/\((\d+)\)/g);
            if (numbers && numbers.length > 0) {
              // Take the last number found (most likely to be cart count)
              const lastNumber = numbers[numbers.length - 1].match(/\((\d+)\)/);
              if (lastNumber && count === 0) {
                count = parseInt(lastNumber[1]);
                cy.log(`✓ Found cart count (last number): ${count} from "${text}"`);
                return false;
              }
            }
          }
        });
      }
      
      cy.log(`Final cart count: ${count}`);
      return cy.wrap(count);
    });
  }

  verifyCartItemCount(expectedCount) {
    this.getCartItemCount().should('equal', expectedCount);
    return this;
  }

  // Advanced Search Methods
  performAdvancedSearch(options = {}) {
    const {
      searchTerm = '',
      category = '',
      priceRange = '',
      manufacturer = ''
    } = options;

    if (searchTerm) {
      this.searchForProduct(searchTerm);
    }

    // Additional filtering can be added here
    if (category) {
      this.navigateToCategory(category);
    }

    return this;
  }

  // Navigation Workflows
  completeLoginFlow(email, password) {
    this.navigateToLogin();
    // Login logic would be handled by LoginPage
    return this;
  }

  completeRegistrationFlow(userData) {
    this.navigateToRegister();
    // Registration logic would be handled by RegisterPage
    return this;
  }

  completeShoppingFlow(searchTerm) {
    this.searchForProduct(searchTerm);
    // Shopping logic would continue in product/cart pages
    return this;
  }

  // Enhanced Business Workflow Methods
  performQuickNavigation(destination) {
    const navigationMap = {
      'home': () => this.navigateToHome(),
      'login': () => this.navigateToLogin(),
      'register': () => this.navigateToRegister(),
      'cart': () => this.openCart(),
      'wishlist': () => this.openWishlist(),
      'account': () => this.openAccount()
    };

    const action = navigationMap[destination.toLowerCase()];
    if (action) {
      action();
    } else {
      throw new Error(`Unknown navigation destination: ${destination}`);
    }
    return this;
  }

  performMultipleSearches(searchTerms) {
    searchTerms.forEach((term, index) => {
      this.searchForProduct(term);
      if (index < searchTerms.length - 1) {
        this.navigateToHome();
      }
    });
    return this;
  }

  validateHeaderElements() {
    this.verifyElementVisible(this.logo);
    this.verifyElementVisible(this.searchBox);
    this.verifyElementVisible(this.navigationMenu);
    this.verifyElementVisible(this.cartLink);
    return this;
  }

  performUserStateTransition(from, to, credentials = null) {
    if (from === 'guest' && to === 'logged-in') {
      this.navigateToLogin();
      // Login would be handled by LoginPage
    } else if (from === 'logged-in' && to === 'guest') {
      this.logout();
      this.verifyUserLoggedOut();
    } else if (from === 'guest' && to === 'registered') {
      this.navigateToRegister();
      // Registration would be handled by RegisterPage
    }
    return this;
  }

  simulateUserNavigation(pattern = 'random') {
    const destinations = ['home', 'login', 'register', 'cart', 'wishlist'];
    
    if (pattern === 'random') {
      const randomDest = destinations[Math.floor(Math.random() * destinations.length)];
      this.performQuickNavigation(randomDest);
    } else if (pattern === 'sequential') {
      destinations.forEach(dest => {
        this.performQuickNavigation(dest);
        cy.wait(500);
      });
    }
    return this;
  }

  checkForPromotionalElements() {
    return cy.get('body').then($body => {
      const banners = $body.find('.banner, .promo, .discount').length;
      const notifications = $body.find('.notification, .alert').length;
      return { banners, notifications };
    });
  }

  performAccessibilityCheck() {
    // Check for alt text on logo
    cy.get(this.logo).find('img').should('have.attr', 'alt');
    
    // Check for proper form labels
    cy.get(this.searchBox).should('have.attr', 'placeholder');
    
    // Check navigation is keyboard accessible
    cy.get(this.navigationMenu).find('a').should('have.attr', 'href');
    
    return this;
  }

  monitorPerformanceMetrics() {
    cy.window().then(win => {
      const navigation = win.performance.getEntriesByType('navigation')[0];
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      cy.log(`Page load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(5000); // 5 second max load time
    });
    return this;
  }
}