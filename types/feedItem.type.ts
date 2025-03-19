import type { CurrencyAndAmount } from "./currencyAndAmount.type"
import { generateMockCurrencyAndAmount } from "./currencyAndAmount.type"
import { faker } from '@faker-js/faker'
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
  counterPartySubEntityIdentifier: string, //sort code
  counterPartySubEntitySubIdentifier: string, //account number
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
export function generateFeedItem(overrides?:any):FeedItem {
  let item =  {
    feedItemUid: faker.string.uuid(),
    categoryUid: faker.string.uuid(),
    amount: generateMockCurrencyAndAmount(),
    sourceAmount: generateMockCurrencyAndAmount(),
    direction: generateTransactionDirection(),
    updatedAt: faker.date.recent().toISOString(),
    transactionTime: faker.date.recent().toISOString(),
    settlementTime: faker.date.recent().toISOString(),
    retryAllocationUntilTime: faker.date.recent().toISOString(),
    source: faker.company.buzzNoun(),
    sourceSubType: faker.company.buzzNoun(),
    status: faker.company.buzzNoun(),
    transactingApplicationUserUid: faker.string.uuid(),
    counterPartyType: faker.company.buzzNoun(),
    counterPartyUid: faker.string.uuid(),
    counterPartyName: faker.company.catchPhrase(),
    counterPartySubEntityUid: faker.string.uuid(),
    counterPartySubEntityName: faker.company.catchPhrase(),
    counterPartySubEntityIdentifier: faker.string.numeric(6),
    counterPartySubEntitySubIdentifier: faker.string.numeric(8),
    exchangeRate: faker.number.float(),
    totalFees: faker.number.int(),
    totalFeeAmount: generateMockCurrencyAndAmount(),
    reference: faker.lorem.slug(), // eg. TESCO-STORES-6148 SOUTHAMPTON GBR
    country: 'GB',
    spendingCategory: faker.company.buzzNoun(),
    userNote: faker.lorem.sentence(),
    roundUp: generateAssociatedFeedRoundup(),
    hasAttachment: faker.datatype.boolean(),
    hasReceipt: faker.datatype.boolean(),
    batchPaymentDetails: generateMockBatchPaymentDetails()
  }

  if(overrides){
    item = {
      ...item,
      ...overrides
    }
  }

  return item
}

/**
 * Wrapper around multiple feed items 
 */
export type FeedItems = {
  feedItems: FeedItem[]
} 

export type TransactionDirection = 'IN' | 'OUT'
export function generateTransactionDirection():TransactionDirection{
  return faker.helpers.arrayElement(['IN', 'OUT'])
}

/**
 * Round up details associated with a feed item
 */
export type AssociatedFeedRoundUp = {
  goalCategoryUid: string,
  amount: CurrencyAndAmount
}
export function generateAssociatedFeedRoundup(): AssociatedFeedRoundUp {
  return {
    goalCategoryUid: faker.string.uuid(),
    amount: generateMockCurrencyAndAmount()
  }
}

/**
 * 	The details of the batch payment this is part of, if it is
 */
export type BatchPaymentDetails = {
  batchPaymentUid: string,
  batchPaymentType: 'BULK_PAYMENT'
}
export function generateMockBatchPaymentDetails():BatchPaymentDetails{
  return {
    batchPaymentUid: faker.string.uuid(),
    batchPaymentType: 'BULK_PAYMENT'
  }
}