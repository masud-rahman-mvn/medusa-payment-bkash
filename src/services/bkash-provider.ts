import BkashBase from "../core/bkash-base";
import { PaymentIntentOptions, PaymentProviderKeys } from "../types";

class BkashProviderService extends BkashBase {
  static identifier = PaymentProviderKeys.BKASH;

  constructor(container, options) {
    super(container, options);
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {};
  }
}

export default BkashProviderService;
