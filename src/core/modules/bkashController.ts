import { Request, Response, Router } from "express";

import bkash from "./bkash";

const bkashController = Router();

bkashController.post("/create", async (req: Request, res: Response) => {
  try {
    const paymentInfo = req.body; // validate body here
    const result = await bkash.createPayment({
      // check bkash response here and store paymentID to Database if needed
      amount: paymentInfo.amount,
      orderID: paymentInfo.orderID,
      intent: "sale",
    });

    return res.status(201).json(result);
  } catch (error: any) {
    console.log("error :>> ", error);
    return res.status(400).json({ success: false, message: error });
  }
});

bkashController.post(
  "/execute/:paymentID",
  async (req: Request, res: Response) => {
    try {
      const paymentID = req.params.paymentID;

      if (!paymentID || paymentID === "")
        throw new Error("Invalid Payment ID provided");

      const result = await bkash.executePayment(paymentID);

      return res.json(result);
    } catch (error: any) {
      console.log("error :>> ", error.response);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
);

bkashController.get(
  "/query/:paymentID",
  async (req: Request, res: Response) => {
    try {
      const paymentID = req.params.paymentID;
      if (!paymentID || paymentID === "")
        throw new Error("Invalid Payment ID provided");
      const result = await bkash.queryPayment(paymentID);
      return res.json({ success: true, data: result });
    } catch (error) {
      return res.status(400).json({ success: false, message: "error.message" });
    }
  }
);

bkashController.get("/search/:trxID", async (req: Request, res: Response) => {
  try {
    const trxID = req.params.trxID;
    if (!trxID || trxID === "")
      throw new Error("Invalid Transaction ID provided");
    const result = await bkash.searchTransaction(trxID);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

bkashController.post("/refund", async (req: Request, res: Response) => {
  try {
    const { paymentID, amount, trxID, sku } = req.body; // validate input here
    const refundTransactionData = {
      paymentID,
      amount,
      trxID,
      sku,
    };
    const result = await bkash.refundTransaction(refundTransactionData);
    return res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

export { bkashController };
