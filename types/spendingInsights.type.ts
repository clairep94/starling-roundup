import type { TransactionDirection } from './feedItem.type'
import { faker } from '@faker-js/faker'

export type SpendingCategorySummary = {
  period?: string, // not included if sent a specific timerange
  totalSpend: number, //eg.1873.27, not minorUnits
  totalReceived: number,
  netSpend: number,
  totalSpendNetOut: number,
  totalReceivedNetIn: number,
  currency: string,
  direction: TransactionDirection,
  breakdown: SpendingCategoryBreakdown[]
}

export function generateSpendAmount(){
  return faker.number.float({multipleOf: 10000})
}
export function generateMockSpendingCategorySummary(overrides?:any){
  let result = {
    totalSpend: generateSpendAmount(),
    totalReceived: generateSpendAmount(),
    netSpend: generateSpendAmount(),
    totalSpendNetOut: generateSpendAmount(),
    totalReceivedNetIn: generateSpendAmount(),
    currency: faker.finance.currencyCode(),
    direction: faker.helpers.arrayElement(['IN', 'OUT']),
    breakdown: [generateMockSpendingCategoryBreakdown(), generateMockSpendingCategoryBreakdown()]
  }
  return {
    ...result,
    ...(overrides ? overrides : {}),
  }
}

export type SpendingCategoryBreakdown = {
  spendingCategory: string,
  totalSpend: number,
  totalSpent: number, //eg.1873.27, not minorUnits
  totalReceived: number,
  netSpend: number,
  netDirection: TransactionDirection,
  currency: string,
  percentage: number, //0-100.0
  transactionCount: number
}

export function generateMockSpendingCategoryBreakdown(overrides: any){
  let result = {
    spendingCategory: faker.company.buzzNoun(),
    totalSpend: generateSpendAmount(),
    totalSpent: generateSpendAmount(),
    totalReceived: generateSpendAmount(),
    netSpend: generateSpendAmount(),
    netDirection: faker.helpers.arrayElement(['IN', 'OUT']),
    currency: faker.finance.currencyCode(),
    percentage: faker.number.float({multipleOf: 100}), //0-100.0
    transactionCount: faker.number.int({min:0, max:100})
  }
  return {
  ...result,
  ...(overrides ? overrides : {}),
  }
}