import axios, { AxiosRequestConfig } from "axios";

const BKASH_USERNAME = "sandboxTestUser";
const BKASH_PASSWORD = "hWD@8vtzw0";
const BKASH_APP_KEY = "5tunt4masn6pv2hnvte1sb5n3j";
const BKASH_APP_SECRET = "1vggbqd4hqk9g96o9rrrp2jftvek578v7d2bnerim12a87dbrrka";

const getToken = async () => {
  try {
    const grantTokenUrl =
      "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/token/grant";

    const options: AxiosRequestConfig = {
      method: "POST",
      url: grantTokenUrl,
      headers: {
        accept: "application/json",
        username: BKASH_USERNAME,
        password: BKASH_PASSWORD,
        "content-type": "application/json",
      },
      data: { app_key: BKASH_APP_KEY, app_secret: BKASH_APP_SECRET },
    };

    const response = await axios(options);

    return response.data;
  } catch (error) {
    console.error(error.data);
  }
};

const createPayment = async (req: any, res: any) => {
  try {
    const request = {
      amount: "85.50",
      intent: "sale",
      currency: "BDT",
      merchantInvoiceNumber: "123456",
    };

    const body = req.body;
    const orderId = req.body.orderId;
    const { id_token } = await getToken();

    const createCheckoutUrl = 1;
    ("https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create");

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

    // const response = await axios(options);

    // res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error.data);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createPayment };
