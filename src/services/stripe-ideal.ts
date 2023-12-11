import BkashBase from "../core/bkash-base";
import { PaymentIntentOptions, PaymentProviderKeys } from "../types";

class IdealProviderService extends BkashBase {
  static identifier = PaymentProviderKeys.IDEAL;

  constructor(_, options) {
    super(_, options);
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {
      payment_method_types: ["ideal"],
      capture_method: "automatic",
    };
  }
}

export default IdealProviderService;
