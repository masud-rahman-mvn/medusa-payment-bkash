import axios, { AxiosRequestConfig } from "axios";
import { RequestHandler } from "express";

const BKASH_USERNAME = "sandboxTestUser";
const BKASH_PASSWORD = "hWD@8vtzw0";
const BKASH_APP_KEY = "5tunt4masn6pv2hnvte1sb5n3j";
const BKASH_APP_SECRET = "1vggbqd4hqk9g96o9rrrp2jftvek578v7d2bnerim12a87dbrrka";

const getGrantToken = async (req: any, res: any) => {
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

    // TODO retrieve product Info by id then send response

    // res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export { getGrantToken };