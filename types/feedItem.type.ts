import type { CurrencyAndAmount } from "./currencyAndAmount.type"

/**
 * 	An item from the account holders's transaction feed
 */
export type FeedItem = {
  feedItemUid: string,
  categoryUid: string,
  amount: CurrencyAndAmount
  sourceAmount: CurrencyAndAmount,
  direction: TransactionDirection,
  updatedAt: string,
  transactionTime: string,
  settlementTime: string,
  retryAllocationUntilTime: string,
  source: string
  sourceSubType: string,
  status: string,
  transactingApplicationUserUid: string,
  counterPartyType: string,
  counterPartyUid: string,
  counterPartyName: string,
  counterPartySubEntityUid: string,
  counterPartySubEntityName: string,
  counterPartySubEntityIdentifier: string,
  counterPartySubEntitySubIdentifier: string,
  exchangeRate: number,
  totalFees: number,
  totalFeeAmount: CurrencyAndAmount,
  reference: string, // eg. TESCO-STORES-6148 SOUTHAMPTON GBR
  country: string,
  spendingCategory: string,
  userNote: string,
  roundUp: AssociatedFeedRoundUp, //Todo: use this to toggle appliedRoundUp?
  hasAttachment: boolean,
  hasReceipt: boolean,
  batchPaymentDetails: BatchPaymentDetails,
}

/**
 * Wrapper around multiple feed items 
 */
export type FeedItems = {
  feedItems: FeedItem[]
} 

export type TransactionDirection = 'IN' | 'OUT'

/**
 * Round up details associated with a feed item
 */
export type AssociatedFeedRoundUp = {
  goalCategoryUid: string,
  amount: CurrencyAndAmount
}

/**
 * 	The details of the batch payment this is part of, if it is
 */
export type BatchPaymentDetails = {
  batchPaymentUid: string,
  batchPaymentType: 'BULK_PAYMENT'
}