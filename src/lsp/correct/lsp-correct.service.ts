import { IRefundSpecification } from './lsp-correct.specifications';
import {
  RefundResponse,
  RefundContext,
  RefundRequest,
} from './lsp-correct-request-response';
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

export interface IPaymentSpecsFactory {
  getSpecifications(provider: PaymentServiceType): IRefundSpecification[];
}

export class RefundService {
  constructor(
    private transactionRepo: ITransactionRepository,
    private processorFactory: IPaymentProcessorFactory,
    private specsFactory: IPaymentSpecsFactory,
  ) {}

  async processRefund(refundRequest: RefundRequest): Promise<RefundResponse> {
    const transaction = await this.transactionRepo.getById(
      refundRequest.transactionId,
    );
    const refundContext: RefundContext = {
      originalTransaction: transaction as Transaction,
    };
    const provider = refundRequest.paymentType;

    const specifications = this.specsFactory.getSpecifications(provider);
    for (const spec of specifications) {
      const isSatisfied = await spec.isSatisfiedBy(
        refundRequest,
        refundContext,
      );
      if (!isSatisfied) {
        await spec.reason(refundRequest, refundContext);
      }
    }

    const processor = this.processorFactory.getProcessor(
      transaction?.provider as PaymentServiceType,
    );

    return await processor.refundPayment(refundRequest, refundContext);
  }
}
