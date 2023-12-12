import { authenticate } from "@medusajs/medusa"
import { ConfigModule } from "@medusajs/types"
import getConfigFile from "@medusajs/utils/dist/common/get-config-file"
import cors from "cors"
import { Router } from "express"


export default (rootDirectory) => {
  const app = Router()

  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  )

  const corsOptions = {
    origin: configModule?.projectConfig?.admin_cors?.split(","),
    credentials: true,
  }

  app.use(
    `/admin/orders/stripe-payments/:order_id`,
    cors(corsOptions),
    authenticate()
  )
  app.get(`/admin/orders/stripe-payments/:order_id`, async (req, res) => {
    // res.json({ payments })
  })

  return app
}
