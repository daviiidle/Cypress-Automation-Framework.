import { DataGenerator } from './dataGenerator.js';

export class UserFactory {
  static createValidUser() {
    return DataGenerator.generateUser();
  }

  static createUserWithInvalidEmail() {
    const user = DataGenerator.generateUser();
    // Try different invalid email formats
    const invalidEmails = [
      'invalid-email',
      'test@',
      'test.com',
      '@test.com',
      'test@@test.com',
      'test space@test.com'
    ];
    user.email = invalidEmails[0]; // Start with the simplest one
    return user;
  }

  static createUserWithShortPassword() {
    const user = DataGenerator.generateUser();
    user.password = '123';
    user.confirmPassword = '123';
    return user;
  }

  static createUserWithMismatchedPasswords() {
    const user = DataGenerator.generateUser();
    user.confirmPassword = 'DifferentPassword123!';
    return user;
  }

  static createMultipleUsers(count = 5) {
    return Array.from({ length: count }, () => this.createValidUser());
  }
}

export class AddressFactory {
  static createUSAddress() {
    return DataGenerator.generateAddress();
  }

  static createInternationalAddress() {
    const address = DataGenerator.generateAddress();
    address.country = 'Canada';
    return address;
  }

  static createIncompleteAddress() {
    const address = DataGenerator.generateAddress();
    address.address1 = '';
    address.city = '';
    return address;
  }

  static createMatchingBillingAndShipping() {
    const address = DataGenerator.generateAddress();
    return {
      billing: { ...address },
      shipping: { ...address }
    };
  }

  static createDifferentBillingAndShipping() {
    return {
      billing: DataGenerator.generateBillingAddress(),
      shipping: DataGenerator.generateShippingAddress()
    };
  }
}

export class PaymentFactory {
  static createValidCreditCard() {
    return DataGenerator.generateCreditCard();
  }

  static createExpiredCreditCard() {
    const card = DataGenerator.generateCreditCard();
    card.expiryMonth = '01';
    card.expiryYear = '2020';
    return card;
  }

  static createInvalidCreditCard() {
    const card = DataGenerator.generateCreditCard();
    card.number = '1234567890123456';
    return card;
  }

  static createPayPalPayment() {
    return DataGenerator.generatePayPalData();
  }

  static createMultiplePaymentMethods() {
    return [
      this.createValidCreditCard(),
      this.createPayPalPayment()
    ];
  }
}

export class OrderFactory {
  static createSimpleOrder() {
    return DataGenerator.generateOrderData();
  }

  static createGuestOrder() {
    const order = DataGenerator.generateOrderData();
    order.isGuest = true;
    order.createAccount = false;
    return order;
  }

  static createRegisteredUserOrder() {
    const order = DataGenerator.generateOrderData();
    order.isGuest = false;
    order.user = UserFactory.createValidUser();
    return order;
  }

  static createExpressCheckoutOrder() {
    const order = DataGenerator.generateOrderData();
    order.expressCheckout = true;
    order.paymentMethod = PaymentFactory.createPayPalPayment();
    return order;
  }

  static createBulkOrder(itemCount = 5) {
    const order = DataGenerator.generateOrderData();
    order.items = Array.from({ length: itemCount }, (_, i) => ({
      productId: i + 1,
      quantity: DataGenerator.getRandomNumber(1, 3),
      productName: `Test Product ${i + 1}`
    }));
    return order;
  }
}

export class TestDataFactory {
  static createTestScenario(scenarioType) {
    switch (scenarioType) {
      case 'happy_path':
        return {
          user: UserFactory.createValidUser(),
          order: OrderFactory.createSimpleOrder(),
          scenario: 'Complete successful purchase flow'
        };
      
      case 'guest_checkout':
        return {
          order: OrderFactory.createGuestOrder(),
          scenario: 'Guest user checkout without registration'
        };
      
      case 'invalid_payment':
        return {
          user: UserFactory.createValidUser(),
          order: {
            ...OrderFactory.createSimpleOrder(),
            paymentMethod: PaymentFactory.createInvalidCreditCard()
          },
          scenario: 'Checkout with invalid payment method'
        };
      
      case 'registration_errors':
        return {
          validUser: UserFactory.createValidUser(),
          invalidUsers: [
            UserFactory.createUserWithInvalidEmail(),
            UserFactory.createUserWithShortPassword(),
            UserFactory.createUserWithMismatchedPasswords()
          ],
          scenario: 'Test various registration validation errors'
        };
      
      default:
        return this.createTestScenario('happy_path');
    }
  }

  static createDataDrivenTest(scenarios) {
    return scenarios.map(scenario => this.createTestScenario(scenario));
  }
}