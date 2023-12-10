import axios, { AxiosRequestConfig } from "axios";
import { RequestHandler } from "express";
import BkashPaymentProcessorService from "../../services/bkash-payment-processor";
import { OrderService, PaymentProcessorContext } from "@medusajs/medusa";

const BKASH_APP_KEY = "5tunt4masn6pv2hnvte1sb5n3j";
const createPayment: RequestHandler = async (req, res) => {
  try {
    const bkashPaymentProcessorService: BkashPaymentProcessorService =
      req.scope.resolve("bkashPaymentProcessorService");

    const context: PaymentProcessorContext = {
      email: "aa@gmail.com",
      context: {},
      currency_code: "bdt",
      amount: 100,
      resource_id: "1",
      customer: undefined,
      paymentSessionData: {},
    };

    bkashPaymentProcessorService.initiatePayment(context);

    const request = req.body;
    const id_token = req.headers.authorization;
    const app_key = req.headers["X-APP-Key"];

    const createCheckoutUrl =
      "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create";

    const options = {
      method: "POST",
      url: createCheckoutUrl,
      headers: {
        accept: "application/json",
        Authorization: id_token,
        "X-APP-Key": BKASH_APP_KEY,
        "content-type": "application/json",
      },
      data: request,
    };
    console.log("options :>> ", options);
    const response = await axios(options);

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error.data);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createPayment };
