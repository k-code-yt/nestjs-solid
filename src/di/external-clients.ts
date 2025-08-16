class StripeClient {
  async refund(
    chargeId: string,
    amount: number,
  ): Promise<{ refundId: string; amount: number; processingTime: number }> {
    await this.delay(500);

    if (chargeId === 'invalid_charge') {
      throw new Error('Invalid charge ID');
    }

    if (amount > 10000) {
      throw new Error('Refund amount too large');
    }

    return {
      refundId: `re_${Math.random().toString(36).substring(7)}`,
      amount: amount,
      processingTime: Math.floor(Math.random() * 1000) + 500,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

class PayPalClient {
  async refund(
    paymentPercentage: number,
    transactionDetails: { paypalEmail: string; transactionId: string },
  ): Promise<{ transactionId: string; paymentPercentage: number }> {
    await this.delay(800);

    if (!transactionDetails.paypalEmail || !transactionDetails.transactionId) {
      throw new Error('PayPal requires transaction details');
    }

    if (paymentPercentage > 100) {
      throw new Error('Cannot refund more than 100% of original payment');
    }

    const transaction = await this.getTransaction(
      transactionDetails.transactionId,
    );
    const daysSinceTransaction =
      (Date.now() - transaction.date) / (1000 * 60 * 60 * 24);

    if (daysSinceTransaction > 180) {
      throw new Error("PayPal doesn't allow refunds after 180 days!");
    }

    if (transactionDetails.paypalEmail === 'blocked@example.com') {
      throw new Error('Account is blocked for refunds');
    }

    return {
      transactionId: `pp_ref_${Math.random().toString(36).substring(7)}`,
      paymentPercentage: paymentPercentage,
    };
  }

  private async getTransaction(
    transactionId: string,
  ): Promise<{ date: number }> {
    const daysAgo = Math.floor(Math.random() * 365);
    return {
      date: Date.now() - daysAgo * 24 * 60 * 60 * 1000,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
