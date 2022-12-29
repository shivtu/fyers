//@ts-ignore
import fyers from "fyers-api-v2";

export async function getQuotes(symbol: string) {
  const quotes = new fyers.quotes();
  const result = await quotes.setSymbol(symbol).getQuotes();
  return result;
}
