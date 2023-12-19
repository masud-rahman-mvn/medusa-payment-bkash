import BkashBase from "src/core/bkash-base";
import { PaymentIntentOptions, PaymentProviderKeys } from "../types";

class StripeProviderService extends BkashBase {
  static identifier = PaymentProviderKeys.BKASH;

  constructor(container, options) {
    super(container, options);
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {};
  }
}

export default StripeProviderService;
