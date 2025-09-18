# Cypress Automation Framework for DemoWebShop

A professional-grade Cypress automation framework using **Faker.js for dynamic data generation** instead of hardcoded test data.

## 🚀 Key Features

- **Page Object Model** - Scalable test architecture
- **Dynamic Data Generation** - Faker.js for realistic, unique test data
- **Data Factories** - Reusable data creation patterns
- **Test Tagging** - Organized test execution (@smoke, @regression, etc.)
- **Parallel Execution** - CI/CD ready with GitHub Actions
- **Rich Reporting** - Mochawesome reports with screenshots/videos
- **Cross-browser Testing** - Chrome, Firefox support

## 📁 Project Structure

```
cypress/
├── e2e/                     # Test files
│   ├── 00-simple-tests.cy.js       # Basic functionality & navigation
│   ├── 01-user-registration.cy.js  # User registration with validation
│   ├── 02-user-login.cy.js         # User login & authentication
│   ├── 03-shopping-cart.cy.js      # Shopping cart functionality
│   ├── 04-data-driven-tests.cy.js  # Data-driven test scenarios
│   └── 05-faker-showcase.cy.js     # Comprehensive Faker demo
├── fixtures/                # Static configuration data
│   ├── products.json
│   ├── users.json (validation messages only)
│   ├── checkout.json (configuration only)
│   └── config.json
├── support/
│   ├── pages/              # Page Object Models
│   │   ├── BasePage.js
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── ProductPage.js
│   │   ├── ShoppingCartPage.js
│   │   └── index.js
│   ├── utils/              # Utilities and data generation
│   │   ├── dataGenerator.js  # Faker-based data generation
│   │   ├── factories.js      # Data factory patterns
│   │   └── helpers.js        # Test helper functions
│   ├── commands.js         # Custom Cypress commands
│   └── e2e.js             # Test configuration
└── reports/               # Generated test reports
```

## 🎯 Why Faker Instead of Hardcoded Data?

### ❌ Problems with Hardcoded Data:
- Data conflicts between test runs
- Predictable, unrealistic test scenarios
- Maintenance overhead for expired cards, etc.
- Poor test isolation
- Same "John Doe" data across all tests

### ✅ Benefits of Faker:
- **Unique data every run** - No conflicts
- **Realistic test data** - Names, addresses, emails that look real
- **Better test coverage** - Different data patterns each execution
- **Test isolation** - Each test gets fresh, unique data
- **Reduced maintenance** - No expired credit cards to update

## 🔧 Setup & Installation

```bash
# Clone and install dependencies
npm install

# Install Cypress binary (Windows users)
npm run cypress:install

# Verify Cypress installation
npm run cypress:verify

# Open Cypress Test Runner
npm run cy:open

# Run tests headlessly
npm run cy:run
```

### 🪟 Windows Users
**Important:** After `npm install`, run `npm run cypress:install` to download the Cypress binary for Windows.

### 🐧 WSL + Windows Users  
If using WSL for development but Windows PowerShell for testing:
- Dependencies installed via WSL ✓
- **Must run** `npm run cypress:install` **in Windows PowerShell** to get Windows binary

## 🧪 Using Dynamic Data Generation

### Basic User Creation
```javascript
import { UserFactory } from '../support/utils/factories';

// Generate a unique user every time
const user = UserFactory.createValidUser();
// Results in: { firstName: "Emma", lastName: "Rodriguez", email: "emma.rodriguez.k8x@example.com", ... }
```

### Address Generation
```javascript
import { AddressFactory } from '../support/utils/factories';

// Generate realistic addresses
const billing = AddressFactory.createUSAddress();
const shipping = AddressFactory.createDifferentBillingAndShipping();
```

### Payment Data
```javascript
import { PaymentFactory } from '../support/utils/factories';

// Generate valid test credit cards
const card = PaymentFactory.createValidCreditCard();
// Results in: { number: "4111111111111111", holderName: "Michael Johnson", expiryYear: "2027", ... }
```

### Complete Order Data
```javascript
import { OrderFactory } from '../support/utils/factories';

// Generate complete checkout data
const order = OrderFactory.createSimpleOrder();
// Includes: billing, shipping, payment, shipping method, notes
```

## 🎨 Data Factory Patterns

### Multiple Test Scenarios
```javascript
import { TestDataFactory } from '../support/utils/factories';

// Create different test scenarios
const happyPath = TestDataFactory.createTestScenario('happy_path');
const guestCheckout = TestDataFactory.createTestScenario('guest_checkout');
const invalidPayment = TestDataFactory.createTestScenario('invalid_payment');
```

### Bulk Data Generation
```javascript
// Generate multiple unique users
const users = UserFactory.createMultipleUsers(5);
users.forEach(user => {
  // Each user has unique email, name, etc.
  cy.log(\`User: \${user.firstName} \${user.lastName} - \${user.email}\`);
});
```

## 🏷️ Test Execution by Tags

```bash
# Run smoke tests only
npm run cy:run:smoke

# Run validation tests
npm run cy:run:validation

# Run data-driven tests
npm run cy:run:data-driven

# Run specific browser
npm run cy:run:chrome
npm run cy:run:firefox
```

## 📊 Example Test with Dynamic Data

```javascript
it('should register user with unique data', () => {
  // Generate fresh data every test run
  const userData = UserFactory.createValidUser();
  
  homePage.navigateToRegister();
  registerPage
    .register(userData)              // Uses dynamic data
    .verifySuccessfulRegistration();
  
  // userData.email is unique each time: "sarah.wilson.x9m@example.com"
});
```

## 🔄 Seeded Data for Consistency

```javascript
// For reproducible tests when needed
DataGenerator.seed(12345);
const user1 = DataGenerator.generateUser();

DataGenerator.seed(12345);
const user2 = DataGenerator.generateUser();

// user1.email === user2.email (same seed = same data)
```

## 🎯 Test Data Philosophy

1. **Static Data** (fixtures) - Configuration, validation messages, product catalogs
2. **Dynamic Data** (Faker) - User info, addresses, payment data, search terms
3. **Factory Pattern** - Reusable data creation for different scenarios
4. **Test Isolation** - Each test gets unique data to prevent conflicts

## 📈 CI/CD Integration

Configured for GitHub Actions with:
- Parallel execution across browsers
- Automatic test reporting
- Screenshot/video capture on failure
- Scheduled nightly runs

## 🚀 Running Tests

```bash
# Interactive mode
npm run cy:open

# Headless execution
npm run test

# Smoke tests only
npm run test:smoke

# With specific browser
npm run cy:run:chrome

# Verify installation
npm run cypress:verify

# Get system info
npm run cypress:info
```

### 🪟 Windows PowerShell Commands
```powershell
# If npm scripts don't work, use npx directly:
npx cypress open
npx cypress run
npx cypress verify
```

## 📋 Custom Commands

```javascript
// Login with dynamic user data
cy.login(user.email, user.password);

// Add random product to cart
cy.addToCart('laptop');

// Clear cart before test
cy.clearCart();
```

This framework demonstrates SDET best practices with dynamic data generation, eliminating the common anti-pattern of hardcoded test data while maintaining realistic and isolated test scenarios.