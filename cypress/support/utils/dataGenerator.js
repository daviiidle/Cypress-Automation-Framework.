import { faker } from '@faker-js/faker';

export class DataGenerator {
  static seed(seedValue) {
    faker.seed(seedValue);
  }
  
  static resetSeed() {
    faker.seed();
  }

  static generateUser() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email().toLowerCase();
    const password = 'Test123!';
    
    return {
      gender: faker.helpers.arrayElement(['Male', 'Female']),
      firstName,
      lastName,
      email,
      password,
      confirmPassword: password
      // newsletter: faker.datatype.boolean() // Not used on this site
    };
  }

  static generateEmail() {
    return faker.internet.email().toLowerCase();
  }

  static generatePassword() {
    return faker.internet.password(8, false, /[A-Za-z0-9!@#$%^&*]/);
  }

  static generateAddress() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      company: faker.company.name(),
      country: 'United States',
      state: faker.location.state(),
      city: faker.location.city(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      zipCode: faker.location.zipCode(),
      phoneNumber: faker.phone.number()
    };
  }

  static generateBillingAddress() {
    return this.generateAddress();
  }

  static generateShippingAddress() {
    return this.generateAddress();
  }

  static generateCreditCard() {
    const validTestCards = [
      '4111111111111111', // Visa
      '5555555555554444', // Mastercard
      '378282246310005',  // American Express
      '4000000000000002'  // Visa (declined)
    ];
    
    const futureDate = faker.date.future({ years: 3 });
    
    return {
      type: 'credit_card',
      number: faker.helpers.arrayElement(validTestCards),
      holderName: faker.person.fullName(),
      expiryMonth: String(futureDate.getMonth() + 1).padStart(2, '0'),
      expiryYear: String(futureDate.getFullYear()),
      cvv: faker.finance.creditCardCVV()
    };
  }

  static generatePayPalData() {
    return {
      type: 'paypal',
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password()
    };
  }

  static generateOrderData() {
    return {
      billingAddress: this.generateBillingAddress(),
      shippingAddress: this.generateShippingAddress(),
      paymentMethod: this.generateCreditCard(),
      shippingMethod: faker.helpers.arrayElement(['Ground', 'Next Day Air', '2nd Day Air']),
      orderNotes: faker.lorem.sentence()
    };
  }

  static generateSearchTerm() {
    const searchTerms = ['laptop', 'book', 'phone', 'camera', 'watch', 'headphones'];
    return faker.helpers.arrayElement(searchTerms);
  }

  static generateInvalidData() {
    return {
      invalidEmail: 'invalid-email-format',
      shortPassword: '123',
      emptyString: '',
      longString: faker.lorem.words(100),
      specialChars: '!@#$%^&*()_+{}[]|\\:;"<>?,./`~',
      sqlInjection: "'; DROP TABLE users; --",
      xssScript: '<script>alert("XSS")</script>'
    };
  }

  static getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  static generateUniqueId() {
    return `test_${Date.now()}_${faker.string.alphanumeric(5)}`;
  }

  static getRandomNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}