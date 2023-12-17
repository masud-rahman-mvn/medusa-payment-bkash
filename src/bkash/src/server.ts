import express from "express";
const app = express();
const port = 3000;

import bodyParser from "body-parser";
import { bkashController } from "./modules/bkashController";
import cors from "cors";
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/bkash", bkashController);

app.listen(port, () => console.log(` app listening on port ${port}!`));
