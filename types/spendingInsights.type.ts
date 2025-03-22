import type { TransactionDirection } from './feedItem.type'

export type SpendingCategorySummary = {
  period?: string, // not included if sent a specific timerange
  totalSpent: number, //eg.1873.27, not minorUnits
  totalReceived: number,
  netSpend: number,
  totalSpendNetOut: number,
  totalReceivedNetIn: number,
  currency: string,
  direction: TransactionDirection,
  breakdown: SpendingCategoryBreakdown[]
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