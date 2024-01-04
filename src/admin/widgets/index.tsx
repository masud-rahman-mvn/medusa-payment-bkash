import { OrderDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";

const MyWidget = (props: OrderDetailsWidgetProps) => {
  return <div>MyWidget Bkash</div>;
};

export const config: WidgetConfig = {
  zone: "order.details.after",
};

export default MyWidget;
