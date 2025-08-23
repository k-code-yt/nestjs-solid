export interface RefundRequest {
  paymentType: PaymentServiceType;
  transactionId: string;
  amount: number;
  timestamp: Date;
  reason?: string;
  metadata?: Record<string, any>;
}

export type RefundContext = {
  originalTransaction: Transaction;
};

// ---------RESPONSE------------
export interface IRefundResponse {
  success: boolean;
  refundId: string | null;
  amount: number;
  error: string | null;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class RefundResponse {
  public readonly success: boolean;
  public readonly refundId: string | null;
  public readonly amount: number;
  public readonly error: string | null;
  public readonly timestamp: Date;
  public readonly metadata: Record<string, any>;

  constructor(response: IRefundResponse) {
    this.success = response.success;
    this.refundId = response.refundId;
    this.amount = response.amount;
    this.error = response.error;
    this.timestamp = response.timestamp;
    this.metadata = response.metadata || {};
  }

  static success(
    refundId: string,
    amount: number,
    metadata?: Record<string, any>,
  ): RefundResponse {
    return new RefundResponse({
      success: true,
      refundId,
      amount,
      error: null,
      timestamp: new Date(),
      metadata,
    });
  }
}
