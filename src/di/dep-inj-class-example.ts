class BasicTaxService {
  calculateTax(amount: number): number {
    return amount * 0.1;
  }
}

class PremiumTaxService {
  calculateTax(amount: number): number {
    return amount * 0.15;
  }
}

class Tax {
  private basicTaxService: BasicTaxService;
  private premiumTaxService: PremiumTaxService;

  constructor(private amount: number) {
    this.basicTaxService = new BasicTaxService();
    this.premiumTaxService = new PremiumTaxService();
  }

  calculateOrderTotal(customerType: string): number {
    let tax = 0;

    switch (customerType) {
      case 'basic':
        tax = this.basicTaxService.calculateTax(this.amount);
        break;
      case 'premium':
        tax = this.premiumTaxService.calculateTax(this.amount);
        break;
    }

    return this.amount + tax;
  }
}

// ---------------
class DatabaseService {
  save(data) {
    console.log('Saving to database:', data);
  }
}

const apiCall = (url) => console.log(`Calling API: ${url}`);

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

const maxRetries = 3;

class FlexibleService {
  private database;
  private apiCall;
  private config;
  private maxRetries;
  constructor(database, apiFunction, configuration, retryLimit) {
    this.database = database; // Class instance
    this.apiCall = apiFunction; // Function
    this.config = configuration; // Object
    this.maxRetries = retryLimit; // Value
  }

  processData(data) {
    this.database.save(data);
    this.apiCall(this.config.apiUrl);
    console.log(`Max retries: ${this.maxRetries}`);
  }
}

const flexibleService = new FlexibleService(
  new DatabaseService(),
  apiCall,
  config,
  maxRetries,
);
