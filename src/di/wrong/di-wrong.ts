// class OrderService {
//   constructor(private readonly stripeClient: StripeClient) {}

//   async refundOrder(chardeId: string, amount: number) {
//     try {
//       return await this.stripeClient.refundPayment(chardeId, amount);
//     } catch (error) {
//       console.error('Refund failed:', error.message);
//       throw error;
//     }
//   }
// }

// const stripeClient = new StripeClient();

// const orderService1 = new OrderService(stripeClient);

// const order = {
//   chargeId: '12345',
//   amount: 100,
// };

// orderService1.refundOrder(order.chargeId, order.amount);

// function getRandomHash() {
//   return Math.random().toString(36).substring(7);
// }
