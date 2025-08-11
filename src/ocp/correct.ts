interface IPricingPolicy {
  calculate(amount: number): number;
}

function policyFactory(
  type: 'regular' | 'premium' | 'luxury',
  dc: IDiscountConfig,
  quantity: number,
): IPricingPolicy {
  switch (type) {
    case 'regular':
      return new RegularPolicy();
    case 'premium':
      return new PremiumPolicy(dc);
    case 'luxury':
      return new LuxuryPolicy(quantity);
  }
}

class RegularPolicy implements IPricingPolicy {
  calculate(amount: number): number {
    return amount * 1.25;
  }
}

class PremiumPolicy implements IPricingPolicy {
  constructor(private readonly dc: IDiscountConfig) {}
  calculate(amount: number): number {
    if (this.dc.hasDiscount) {
      return amount * 1.15 * this.dc.percentage;
    }
    return amount * 1.15;
  }
}

class LuxuryPolicy implements IPricingPolicy {
  constructor(private readonly quantity: number) {}

  calculate(amount: number): number {
    if (this.quantity > 500) {
      return amount * 1.05;
    }
    return amount * 1.1;
  }
}

//-----------
const quantity = getQuantyFromDB();
const dc: IDiscountConfig = {
  hasDiscount: true,
  percentage: 1,
};
const policy = policyFactory('premium', dc, quantity);
const result = policy.calculate(600);

const regular = new RegularPolicy();

// open for extension
// closed for modification
