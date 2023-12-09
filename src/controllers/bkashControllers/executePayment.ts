import axios, { AxiosRequestConfig } from "axios";

interface IOptions {
  method: string;
  url: string;
  headers: {
    accept: string;
    Authorization: string;
    "X-APP-Key": string;
    "content-type": string;
  };
  data: {
    paymentID: string;
  };
}

const executePayment = async (req: any, res: any) => {
  try {
    const { paymentID } = req.params;
    const { id_token, app_key } = req.headers;

    const options: AxiosRequestConfig = {
      method: "POST",
      url: `https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute/${paymentID}`,
      headers: {
        accept: "application/json",
        Authorization: id_token, // Assuming id_token is the correct header value
        "X-APP-Key": app_key, // Assuming app_key is the correct header value
        "content-type": "application/json",
      },
      data: { paymentID },
    };

    const response = await axios(options);

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
};

export { executePayment };
