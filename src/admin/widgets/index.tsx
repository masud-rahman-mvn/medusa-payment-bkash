import { OrderDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import { useAdminCustomQuery } from "medusa-react";
import { ListStripeIntentRes } from "../../types";

const MyWidget = (props: OrderDetailsWidgetProps) => {
  return <div>MyWidget</div>;
};

export const config: WidgetConfig = {
  zone: "order.details.after",
};

export default MyWidget;
