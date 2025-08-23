import { RefundService } from './lsp/correct/lsp-correct.service';
import { PaymentServiceType } from './lsp/correct/enums';
import { RefundSpecificationFactory } from './lsp/correct/lsp-correct-specification.factory';
import { TransactionRepository } from './lsp/correct/lsp-correct-repo';
import { PaymentProcessorFactory } from './lsp/correct/lsp-correct-policy.factories';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const repo = new TransactionRepository();
  const paymentProcessorFactory = new PaymentProcessorFactory();
  const specsFactory = new RefundSpecificationFactory();
  const service = new RefundService(
    repo,
    paymentProcessorFactory,
    specsFactory,
  );
  const refund = await service.processRefund({
    amount: 100,
    timestamp: new Date(),
    transactionId: 'uuid',
    paymentType: PaymentServiceType.Paypal,
  });
  Logger.log(refund, 'RESULT:SUCCESS');
}
bootstrap();
