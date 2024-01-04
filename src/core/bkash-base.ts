import {
  AbstractPaymentProcessor,
  isPaymentProcessorError,
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus,
} from "@medusajs/medusa";
import { EOL } from "os";

import {
  ErrorCodes,
  ErrorIntentStatus,
  BkashOptions,
  PaymentCreateResponse,
} from "../types";
import { MedusaError } from "@medusajs/utils";
import BkashGateway from "../bkash/index";
import { IBkashExecutePaymentResponse } from "src/bkash/interfaces/bkashResponse.interface";

abstract class BkashBase extends AbstractPaymentProcessor {
  static identifier = "";

  protected readonly options_: BkashOptions;
  protected bkash: BkashGateway;

  protected constructor(container, options) {
    super(container, options);

    this.options_ = options;

    this.init();
  }

  protected init(): void {
    this.bkash = new BkashGateway({
      baseURL: process.env.BKASH_BASEURL,
      key: process.env.BKASH_API_KEY,
      secret: process.env.BKASH_API_SECRET,
      username: process.env.BKASH_USERNAME,
      password: process.env.BKASH_PASSWORD,
    });
  }

  // progress
  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    const id = paymentSessionData.id as string; //TODO paymentID
    const paymentIntent = await this.bkash.queryPayment(id);
    if (paymentIntent.transactionStatus === "Completed") {
      return PaymentSessionStatus.AUTHORIZED;
    } else if (paymentIntent.transactionStatus === "Initiated") {
      return PaymentSessionStatus.PENDING;
    } else {
      return PaymentSessionStatus.PENDING;
    }
  }
  // progress customer
  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    const {
      billing_address,
      email,
      context: cart_context,
      currency_code,
      amount,
      resource_id,
      customer,
      paymentSessionData,
    } = context;
    let paymentCreateResponse: PaymentCreateResponse;
    let bkashExecutePaymentResponse: IBkashExecutePaymentResponse;
    try {
      // check bkash response here and store paymentID to Database if needed
      paymentCreateResponse = await this.bkash.createPayment({
        amount: amount,
        orderID: paymentSessionData.cart_id as string, // TODO orderId or cartId give here
        intent: "sale",
      });
    } catch (e) {
      return this.buildError(
        "An error occurred in InitiatePayment during the creation of the stripe payment intent",
        e
      );
    }

    return {
      session_data: {
        bkashPaymentSessionData: {
          paymentCreateResponse,
          bkashExecutePaymentResponse,
        },
      },
      update_requests: {
        customer_metadata: {
          bkash_id: "session_data.customer", //TODO update here
        },
      },
    };
  }
  // progress customer
  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | {
        status: PaymentSessionStatus;
        data: PaymentProcessorSessionResponse["session_data"];
      }
  > {
    const id = paymentSessionData.id as string; // TODO paymentID should give here
    const status = await this.getPaymentStatus(paymentSessionData);
    if (status !== "authorized") {
      const data = await this.bkash.executePayment(id);
      return { data: paymentSessionData, status };
    }
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    try {
      return {
        id: "test",
      };
    } catch (error) {
      if (error.payment_intent?.status === ErrorIntentStatus.CANCELED) {
        return error.payment_intent;
      }

      return this.buildError("An error occurred in cancelPayment", error);
    }
  }
  // progress admin
  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    const id = paymentSessionData.id as string;
    try {
      // TODO paymentID should give here and the
      const intent = await this.bkash.executePayment(id);

      return intent as unknown as PaymentProcessorSessionResponse["session_data"];
    } catch (error) {
      if (error.code === ErrorCodes.PAYMENT_INTENT_UNEXPECTED_STATE) {
        if (error.payment_intent?.status === ErrorIntentStatus.SUCCEEDED) {
          return error.payment_intent;
        }
      }

      return this.buildError("An error occurred in capturePayment", error);
    }
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    return await this.cancelPayment(paymentSessionData);
  }
  // progress
  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    try {
      const id = paymentSessionData.id as string; //TODO transaction ID

      //TODO update parameter
      const data = this.bkash.refundTransaction({
        paymentID: "22423169",
        amount: "25.69", //do not add more than two decimal points
        trxID: "TRX22347463XX",
        sku: "SK256519",
      });
    } catch (e) {
      return this.buildError("An error occurred in refundPayment", e);
    }

    return paymentSessionData;
  }
  // progress
  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<
    PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]
  > {
    try {
      const id = paymentSessionData.id as string; //TODO transaction id
      const intent = await this.bkash.searchTransaction(id);
      return intent as unknown as PaymentProcessorSessionResponse["session_data"];
    } catch (e) {
      return this.buildError("An error occurred in retrievePayment", e);
    }
  }
  // progress
  async updatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void> {
    const { amount, customer, paymentSessionData } = context;
    const bkashId = customer?.metadata?.bkash_id;
    if (bkashId !== paymentSessionData.customer) {
      const result = await this.initiatePayment(context);
      if (isPaymentProcessorError(result)) {
        return this.buildError(
          "An error occurred in updatePayment during the initiate of the new payment for the new customer",
          result
        );
      }
      return result;
    }
  }
  // progress
  async updatePaymentData(sessionId: string, data: Record<string, unknown>) {
    try {
      // Prevent from updating the amount from here as it should go through
      // the updatePayment method to perform the correct logic
      if (data.amount) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot update amount, use updatePayment instead"
        );
      }

      return {
        ...data,
      } as unknown as PaymentProcessorSessionResponse["session_data"];
    } catch (e) {
      return this.buildError("An error occurred in updatePaymentData", e);
    }
  }

  // TODO webhook event
  /**
   * Constructs Stripe Webhook event
   * @param {object} data - the data of the webhook request: req.body
   * @param {object} signature - the Stripe signature on the event, that
   *    ensures integrity of the webhook event
   * @return {object} Stripe Webhook event
   */
  // constructWebhookEvent(data, signature) {
  //   return this.stripe_.webhooks.constructEvent(
  //     data,
  //     signature,
  //     this.options_.webhook_secret
  //   );
  // }

  protected buildError(
    message: string,
    e: PaymentProcessorError | Error
  ): PaymentProcessorError {
    return {
      error: message,
      code: "code" in e ? e.code : "",
      detail: isPaymentProcessorError(e)
        ? `${e.error}${EOL}${e.detail ?? ""}`
        : "detail" in e
        ? e.detail
        : e.message ?? "",
    };
  }
}

export default BkashBase;
