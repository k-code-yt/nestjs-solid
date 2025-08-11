interface ITaxCalculator {
  (amount: number): number;
}

const basicTaxCalculator = (amount: number) => amount * 0.1;
const premiumTaxCalculator = (amount: number) => amount * 0.15;

function calculateTaxType(amount: number, type: 'basic' | 'premium') {
  switch (type) {
    case 'basic':
      return basicTaxCalculator(amount);
    case 'premium':
      return premiumTaxCalculator(amount);
  }
}

function calculateTaxInjection(amount: number, taxCalculator: ITaxCalculator) {
  return taxCalculator(amount);
}
