export class PaymentProcessorFactory implements IPaymentProcessorFactory {
  getProcessor(provider: PaymentServiceType): IPaymentProcessor {
    switch (provider) {
      case PaymentServiceType.Paypal:
        return new PayPalAdapter();
      case PaymentServiceType.Stripe:
        return new StripeAdapter();
    }
  }
}
