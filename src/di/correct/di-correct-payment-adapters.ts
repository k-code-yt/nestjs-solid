class StripeAdapter implements IPaymentProcessor {
  private stripeClient: StripeClient;

  constructor() {
    this.stripeClient = new StripeClient();
  }

  async refundPayment(
    request: RefundRequest,
    context: RefundContext,
  ): Promise<RefundResponse> {
    try {
      if (context.originalTransaction.provider !== PaymentServiceType.Stripe) {
        return RefundResponse.failure(
          request.amount,
          'Invalid provider for Stripe processor',
        );
      }

      const result = await this.stripeClient.refund(
        context.originalTransaction.paymentMethodDetails.stripeChargeId,
        request.amount,
      );

      return RefundResponse.success(result.refundId, result.amount, {
        stripe_data: {
          chargeId:
            context.originalTransaction.paymentMethodDetails.stripeChargeId,
          stripeRefundId: result.refundId,
          processingTime: result.processingTime,
        },
        provider: PaymentServiceType.Stripe,
      });
    } catch (error) {
      return RefundResponse.failure(request.amount, error.message, {
        stripe_data: {
          chargeId:
            context.originalTransaction.paymentMethodDetails.stripeChargeId,
          errorCode: error.code || 'UNKNOWN',
        },
      });
    }
  }
}

class PayPalAdapter implements IPaymentProcessor {
  private paypalClient: PayPalClient;

  constructor() {
    this.paypalClient = new PayPalClient();
  }

  async refundPayment(
    request: RefundRequest,
    context: RefundContext,
  ): Promise<RefundResponse> {
    try {
      if (context.originalTransaction.provider !== PaymentServiceType.Paypal) {
        return RefundResponse.failure(
          request.amount,
          'Invalid provider for PayPal processor',
        );
      }

      const paymentPercentage =
        (request.amount / context.originalTransaction.totalAmount) * 100;

      const result = await this.paypalClient.refund(paymentPercentage, {
        paypalEmail:
          context.originalTransaction.paymentMethodDetails.paypalEmail,
        transactionId: request.transactionId,
      });

      return RefundResponse.success(result.transactionId, request.amount, {
        paypal_data: {
          originalTransactionId: request.transactionId,
          paymentPercentage: paymentPercentage,
          paypalEmail:
            context.originalTransaction.paymentMethodDetails.paypalEmail,
        },
        provider: PaymentServiceType.Paypal,
        refundMethod: 'percentage',
      });
    } catch (error) {
      return RefundResponse.failure(request.amount, error.message, {
        paypal_data: {
          transactionId: request.transactionId,
          errorType: this.categorizeError(error),
        },
      });
    }
  }

  private categorizeError(error: any): string {
    if (error.message.includes('180 days')) return 'TIME_LIMIT_EXCEEDED';
    if (error.message.includes('email')) return 'MISSING_EMAIL';
    if (error.message.includes('blocked')) return 'ACCOUNT_BLOCKED';
    if (error.message.includes('100%')) return 'AMOUNT_EXCEEDED';
    return 'UNKNOWN_ERROR';
  }
}
