import type { FeedItem } from "../types/feedItem.type";
import type { CurrencyAndAmount } from "../types/currencyAndAmount.type";

export function findRoundUpAmount(amount: CurrencyAndAmount): number{
  const { minorUnits } = amount;
  return (Math.ceil(minorUnits / 100) * 100 - minorUnits)
}

export function calculateRoundUpFromTransactionFeed(transactionFeedList: FeedItem[]): number{
  return transactionFeedList.reduce((acc, item) => acc + findRoundUpAmount(item.amount), 0);
}