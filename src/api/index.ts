import { authenticate } from "@medusajs/medusa";
import { ConfigModule } from "@medusajs/types";
import getConfigFile from "@medusajs/utils/dist/common/get-config-file";
import cors from "cors";
import hooks from "./hooks";
import { createPayment } from "../controllers/bkashControllers/createPayment";

import { getProductInfo } from "../controllers/bkashControllers/getProductInfo";

import bodyParser from "body-parser";
import { Router } from "express";
import { capturePayment } from "../controllers/bkashControllers/capturePayment";

export default (rootDirectory: any) => {
  const app = Router();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

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

  app.post("/checkout/product-info/:order_id", getProductInfo);
  app.post("/checkout/payment/create", createPayment);
  app.post("/checkout/payment/capture", capturePayment);

  return app;
};
