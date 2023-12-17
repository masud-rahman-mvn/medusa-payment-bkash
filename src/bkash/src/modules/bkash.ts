import dotenv from "dotenv";
dotenv.config();
import BkashGateway from "..";
import { IBkashConstructor } from "../interfaces/main.interface";

const bkash = new BkashGateway({
  baseURL: process.env.BKASH_BASEURL,
  key: process.env.BKASH_API_KEY,
  secret: process.env.BKASH_API_SECRET,
  username: process.env.BKASH_USERNAME,
  password: process.env.BKASH_PASSWORD,
} as IBkashConstructor);

export default bkash;
