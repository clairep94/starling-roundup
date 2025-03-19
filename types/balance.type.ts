import type { CurrencyAndAmount } from "./currencyAndAmount.type"
import { generateMockCurrencyAndAmount } from "./currencyAndAmount.type"

export type Balance = {
  "clearedBalance": CurrencyAndAmount,
  "effectiveBalance": CurrencyAndAmount,
  "pendingTransactions": CurrencyAndAmount,
  "acceptedOverdraft": CurrencyAndAmount,
  "amount": CurrencyAndAmount,
  "totalClearedBalance": CurrencyAndAmount,
  "totalEffectiveBalance": CurrencyAndAmount
  }

export function generateMockBalance(): Balance {
  return {
    clearedBalance: generateMockCurrencyAndAmount(),
    effectiveBalance: generateMockCurrencyAndAmount(),
    pendingTransactions: generateMockCurrencyAndAmount(),
    acceptedOverdraft: generateMockCurrencyAndAmount(),
    amount: generateMockCurrencyAndAmount(),
    totalClearedBalance: generateMockCurrencyAndAmount(),
    totalEffectiveBalance: generateMockCurrencyAndAmount()
  }
}