import { Logger, authenticate } from "@medusajs/medusa";
import { ConfigModule } from "@medusajs/types";
import getConfigFile from "@medusajs/utils/dist/common/get-config-file";
import cors from "cors";
import bodyParser from "body-parser";
import { Router } from "express";

export default (rootDirectory) => {
  console.log("first");
  const app = Router();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

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
  app.get(`/admin/orders/stripe-payments/:order_id`, async (req, res) => {
    res.json({ message: "test" });
  });

  app.get(`/admin/test`, async (req, res) => {
    const logger = req.scope.resolve<Logger>("logger");

    
    logger.info("test");

    res.json({ message: "test" });
  });

  return app;
};
