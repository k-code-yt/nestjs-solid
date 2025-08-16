class TransactionRepository implements ITransactionRepository {
  private transactions: Map<string, Transaction> = new Map();

  async getById(transactionId: string): Promise<Transaction | null> {
    return this.transactions.get(transactionId) || null;
  }
}

class Transaction {
  constructor(
    public readonly id: string,
    public readonly provider: PaymentServiceType,
    public readonly totalAmount: number,
    public readonly paymentMethodDetails: PaymentMethodDetails,
    public readonly createdAt: Date = new Date(),
  ) {}
}

class PaymentMethodDetails {
  constructor(
    public readonly type: PaymentServiceType,
    public readonly data: Record<string, any>,
  ) {}

  get stripeChargeId(): string {
    return this.data.chargeId || this.data.id;
  }

  get paypalEmail(): string {
    return this.data.paypalEmail;
  }
}
