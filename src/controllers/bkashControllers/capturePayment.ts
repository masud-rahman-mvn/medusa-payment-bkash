import { RequestHandler } from "express";

const capturePayment: RequestHandler = async (req, res) => {
  try {
    const body = req.body;

    console.log("body :>> ", body);
    res.status(200).json({ message: "database update done by capture" });
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
};

export { capturePayment };
