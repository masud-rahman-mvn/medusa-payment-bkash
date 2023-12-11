import BkashBase from "../core/stripe-base";
import { PaymentIntentOptions, PaymentProviderKeys } from "../types";

class BlikProviderService extends BkashBase {
  static identifier = PaymentProviderKeys.BLIK;

  constructor(_, options) {
    super(_, options);
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {
      payment_method_types: ["blik"],
      capture_method: "automatic",
    };
  }
}

export default BlikProviderService;
