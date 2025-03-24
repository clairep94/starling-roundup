import type { FeedItem } from "../types/feedItem.type";
import type { CurrencyAndAmount } from "../types/currencyAndAmount.type";

export function findRoundUpAmount(amount: CurrencyAndAmount): number{
  const { minorUnits } = amount;
  return (Math.ceil(minorUnits / 100) * 100 - minorUnits)
}

export function calculateRoundUpFromTransactionFeed(transactionFeedList: FeedItem[]): number{
  return transactionFeedList.reduce((acc, item) => acc + findRoundUpAmount(item.amount), 0);
}

/**
 * Assumption that only outgoing transactions that are NOT "INTERNAL_TRANSFER" can be applied topups with -- I believe this is the behaviour on the app
 * So that users cannot apply topups on past topup transactions
 */
export function isEligibleForRoundup(item:FeedItem):boolean{
  return item.direction === 'OUT' && item.source !== "INTERNAL_TRANSFER" && !item.userNote
}