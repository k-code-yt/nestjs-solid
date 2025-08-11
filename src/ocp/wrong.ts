interface IDiscountConfig {
  hasDiscount: boolean;
  percentage: number;
}

function calculatePrice(
  amount: number,
  cutsomerType: 'regular' | 'premium' | 'luxury',
  dc: IDiscountConfig,
) {
  switch (cutsomerType) {
    case 'regular':
      return amount * 1.25;
    case 'premium':
      if (dc.hasDiscount) {
        return amount * 1.15 * (1 - dc.percentage);
      }
      return amount * 1.15;
    case 'luxury':
      const quantity = getQuantyFromDB();
      if (quantity > 400) {
        return amount * 1.1 * 0.99;
      }
      return amount * 1.1;
  }
}

function getQuantyFromDB(): number {
  return Math.random() * 1000;
}
