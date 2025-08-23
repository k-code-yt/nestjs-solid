import { IPaymentSpecsFactory } from './lsp-correct.service';
import {
  IRefundSpecification,
  PayPalDataConsistencySpecification,
  PayPalProviderSpecification,
  PayPalTimeLimitSpecification,
  RefundAmountSpecification,
  StripeDataConsistencySpecification,
  StripeProviderSpecification,
  TransactionExistsSpecification,
} from './lsp-correct.specifications';

export class RefundSpecificationFactory implements IPaymentSpecsFactory {
  public getSpecifications(
    provider: PaymentServiceType,
  ): IRefundSpecification[] {
    const commonSpecs = [
      new TransactionExistsSpecification(),
      new RefundAmountSpecification(),
    ];

    switch (provider) {
      case PaymentServiceType.Stripe:
        return [
          ...commonSpecs,
          new StripeProviderSpecification(),
          new StripeDataConsistencySpecification(),
        ];

      case PaymentServiceType.Paypal:
        return [
          ...commonSpecs,
          new PayPalProviderSpecification(),
          new PayPalDataConsistencySpecification(),
          new PayPalTimeLimitSpecification(),
        ];

      default:
        return commonSpecs;
    }
  }
}
