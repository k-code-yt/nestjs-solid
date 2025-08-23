import { BadRequestException } from '@nestjs/common';

export interface IRefundSpecification {
  isSatisfiedBy(
    request: RefundRequest,
    context: RefundContext,
  ): Promise<boolean>;
  reason(request: RefundRequest, context: RefundContext): Promise<void>;
}

export class StripeProviderSpecification implements IRefundSpecification {
  async isSatisfiedBy(
    request: RefundRequest,
    context: RefundContext,
  ): Promise<boolean> {
    if (context.originalTransaction.provider !== PaymentServiceType.Stripe) {
      return false;
    }
    return true;
  }

  reason(request: RefundRequest, context: RefundContext): Promise<void> {
    throw new BadRequestException(
      'INVALID_PROVIDER',
      JSON.stringify({
        expectedProvider: PaymentServiceType.Stripe,
        actualProvider: context.originalTransaction.provider,
      }),
    );
  }
}

export class StripeDataConsistencySpecification
  implements IRefundSpecification
{
  async isSatisfiedBy(
    request: RefundRequest,
    context: RefundContext,
  ): Promise<boolean> {
    if (!context.originalTransaction?.paymentMethodDetails?.stripeChargeId) {
      return false;
    }

    return true;
  }

  reason(request: RefundRequest, context: RefundContext): Promise<void> {
    throw new BadRequestException(
      'MISSING_DATA',
      JSON.stringify({
        requiredFields: 'chargeId',
        provider: context.originalTransaction.provider,
      }),
    );
  }
}

export class PayPalProviderSpecification implements IRefundSpecification {
  async isSatisfiedBy(
    request: RefundRequest,
    context: RefundContext,
  ): Promise<boolean> {
    if (context.originalTransaction.provider !== PaymentServiceType.Paypal) {
      return false;
    }
    return true;
  }

  reason(request: RefundRequest, context: RefundContext): Promise<void> {
    throw new BadRequestException(
      'INVALID_PROVIDER',
      JSON.stringify({
        expectedProvider: PaymentServiceType.Paypal,
        actualProvider: context.originalTransaction.provider,
      }),
    );
  }
}

export class PayPalDataConsistencySpecification
  implements IRefundSpecification
{
  async isSatisfiedBy(
    request: RefundRequest,
    context: RefundContext,
  ): Promise<boolean> {
    if (!context.originalTransaction?.paymentMethodDetails?.paypalEmail) {
      return false;
    }
    return true;
  }

  reason(request: RefundRequest, context: RefundContext): Promise<void> {
    throw new BadRequestException(
      'MISSING_DATA',
      JSON.stringify({
        requiredFields: 'paypalEmail',
        provider: context.originalTransaction.provider,
      }),
    );
  }
}

export class PayPalTimeLimitSpecification implements IRefundSpecification {
  async isSatisfiedBy(
    request: RefundRequest,
    context: RefundContext,
  ): Promise<boolean> {
    const daysSinceTransaction =
      (Date.now() - context.originalTransaction.createdAt.getTime()) /
      (1000 * 60 * 60 * 24);

    return daysSinceTransaction <= 180;
  }

  reason(request: RefundRequest, context: RefundContext): Promise<void> {
    const daysSinceTransaction =
      (Date.now() - context.originalTransaction.createdAt.getTime()) /
      (1000 * 60 * 60 * 24);

    throw new BadRequestException(
      'TIME_LIMIT_EXCEEDED',
      JSON.stringify({
        message: "PayPal doesn't allow refunds after 180 days",
        daysSinceTransaction: Math.floor(daysSinceTransaction),
        maxAllowedDays: 180,
      }),
    );
  }
}

export class RefundAmountSpecification implements IRefundSpecification {
  async isSatisfiedBy(
    request: RefundRequest,
    context: RefundContext,
  ): Promise<boolean> {
    if (request.amount <= 0) {
      return false;
    }

    if (request.amount > context.originalTransaction.totalAmount) {
      return false;
    }

    return true;
  }

  reason(request: RefundRequest, context: RefundContext): Promise<void> {
    if (request.amount <= 0) {
      throw new BadRequestException(
        'INVALID_AMOUNT',
        JSON.stringify({
          message: 'Refund amount must be positive',
          providedAmount: request.amount,
        }),
      );
    }

    throw new BadRequestException(
      'AMOUNT_EXCEEDED',
      JSON.stringify({
        message: 'Refund amount cannot exceed original transaction amount',
        requestedAmount: request.amount,
        maxAmount: context.originalTransaction.totalAmount,
      }),
    );
  }
}

export class TransactionExistsSpecification implements IRefundSpecification {
  async isSatisfiedBy(
    request: RefundRequest,
    context: RefundContext,
  ): Promise<boolean> {
    return (
      context.originalTransaction !== null &&
      context.originalTransaction !== undefined
    );
  }

  reason(request: RefundRequest, context: RefundContext): Promise<void> {
    throw new BadRequestException(
      'TRANSACTION_NOT_FOUND',
      JSON.stringify({
        message: 'Transaction not found',
        transactionId: request.transactionId,
      }),
    );
  }
}
