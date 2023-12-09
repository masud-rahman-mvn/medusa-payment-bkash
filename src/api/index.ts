import { authenticate } from "@medusajs/medusa";
import { ConfigModule } from "@medusajs/types";
import getConfigFile from "@medusajs/utils/dist/common/get-config-file";
import cors from "cors";
import { Router } from "express";
import hooks from "./hooks";
import { getProductInfo } from "../controllers/bkashControllers/getGrantToken";
import { createPayment } from "../controllers/bkashControllers/createPayment";
import { executePayment } from "../controllers/bkashControllers/executePayment";
import axios, { AxiosRequestConfig } from "axios";
import { getStripePayments } from "../controllers/get-payments";
import express from "express";
import bodyParser from "body-parser";

const BKASH_USERNAME = "sandboxTestUser";
const BKASH_PASSWORD = "hWD@8vtzw0";
const BKASH_APP_KEY = "5tunt4masn6pv2hnvte1sb5n3j";
const BKASH_APP_SECRET = "1vggbqd4hqk9g96o9rrrp2jftvek578v7d2bnerim12a87dbrrka";

export default (rootDirectory: any) => {
  const app = Router();
  app.use(bodyParser.urlencoded({ extended: true }));

  hooks(app);

  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  );

  const corsOptions = {
    origin: configModule?.projectConfig?.admin_cors?.split(","),
    credentials: true,
  };

  app.use(
    `/admin/orders/stripe-payments/:order_id`,
    cors(corsOptions),
    authenticate()
  );

  // app.get(`/admin/orders/stripe-payments/:order_id`, async (req, res) => {
  //   const payments = await getStripePayments(req);
  //   res.json({ payments });
  // });

  app.post("/checkout/product-info", getProductInfo);
  // app.post("/checkout/payment/create", createPayment);

  // app.post("/execute-payment/:paymentID", executePayment);

  // app.get(`/store/test`, async (req, res) => {
  //   const payments = await getStripePayments(req);

  //   console.log("payments :>> ");
  //   res.json({ success: "hello" });
  // });

  return app;
};
