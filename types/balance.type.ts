import type { CurrencyAndAmount } from "./feedItem.type"

export type Balance = {
  "clearedBalance": CurrencyAndAmount,
  "effectiveBalance": CurrencyAndAmount,
  "pendingTransactions": CurrencyAndAmount,
  "acceptedOverdraft": CurrencyAndAmount,
  "amount": CurrencyAndAmount,
  "totalClearedBalance": CurrencyAndAmount,
  "totalEffectiveBalance": CurrencyAndAmount
  }