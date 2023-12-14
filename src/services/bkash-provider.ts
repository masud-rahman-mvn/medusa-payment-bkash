import StripeBase from "../core/stripe-base";
import { PaymentIntentOptions, PaymentProviderKeys } from "../types";

class StripeProviderService extends StripeBase {
  static identifier = PaymentProviderKeys.BKASH;

  constructor(_, options) {
    super(_, options);
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {};
  }
}

export default StripeProviderService;
