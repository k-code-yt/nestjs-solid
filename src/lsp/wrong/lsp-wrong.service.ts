// Objects of a superclass should be replaceable with objects
// of a subclass without breaking the application.

// In simple terms: If you have a base class and derived classes,
// you should be able to use ANY derived class wherever the base
// class is expected, and everything should still work.

export interface IPaymentProcessor {
  refundPayment(
    request: RefundRequest, // external input
    context: RefundContext, // from our storage
  ): Promise<RefundResponse>;
}

export interface ITransactionRepository {
  getById(transactionId: string): Promise<Transaction | null>;
}

export interface IPaymentProcessorFactory {
  getProcessor(provider: PaymentServiceType): IPaymentProcessor;
}

export class RefundService {
  constructor(
    private transactionRepo: ITransactionRepository,
    private processorFactory: IPaymentProcessorFactory,
  ) {}

  async processRefund(refundRequest: RefundRequest): Promise<RefundResponse> {
    try {
      const transaction = await this.transactionRepo.getById(
        refundRequest.transactionId,
      );
      if (!transaction) {
        return RefundResponse.failure(
          refundRequest.amount,
          `Transaction not found: ${refundRequest.transactionId}`,
        );
      }
      const processor = this.processorFactory.getProcessor(
        transaction.provider,
      );

      const refundContext: RefundContext = {
        originalTransaction: transaction,
      };
      return await processor.refundPayment(refundRequest, refundContext);
    } catch (error) {
      return RefundResponse.failure(refundRequest.amount, error.message);
    }
  }
}

const repo = new TransactionRepository();
const factory = new PaymentProcessorFactory();
const service = new RefundService(repo, factory);
service.processRefund({
  amount: 100,
  timestamp: new Date(),
  transactionId: 'uuid',
});
