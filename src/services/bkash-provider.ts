import BkashBase from "../core/bkash-base";
import { PaymentIntentOptions, PaymentProviderKeys } from "../types";

class StripeProviderService extends BkashBase {
  static identifier = PaymentProviderKeys.BKASH;

  constructor(_, options) {
    super(_, options);
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {};
  }
}

export default StripeProviderService;
