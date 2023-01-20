import { BitlyClient } from "bitly";
import * as dotenv from "dotenv";
dotenv.config();
const bitly = new BitlyClient(process.env.BITLY_ACCESS_TOKEN);

export const generateShortLink = async (url) => {
  const response = await bitly.shorten(url);
  console.log(`Your shortened bitlink is ${response.link}`);
  return response.link;
};
