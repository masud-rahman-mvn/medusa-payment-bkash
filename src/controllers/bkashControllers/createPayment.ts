import axios, { AxiosRequestConfig } from "axios";
import { RequestHandler } from "express";
const BKASH_APP_KEY = "5tunt4masn6pv2hnvte1sb5n3j";
const createPayment: RequestHandler = async (req, res) => {
  try {
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
    const response = await axios(options);

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error.data);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createPayment };
