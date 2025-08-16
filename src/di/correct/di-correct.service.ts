interface IPaymentProcessor {
  refundPayment(
    request: RefundRequest, // external input
    context: RefundContext, // from our storage
  ): Promise<RefundResponse>;
}

interface ITransactionRepository {
  getById(transactionId: string): Promise<Transaction | null>;
}

interface IPaymentProcessorFactory {
  getProcessor(provider: PaymentServiceType): IPaymentProcessor;
}

class RefundService {
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
