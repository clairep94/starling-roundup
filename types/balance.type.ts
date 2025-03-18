import type { CurrencyAndAmount } from "./currencyAndAmount.type"
import { faker } from '@faker-js/faker'

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
    clearedBalance: {currency: "GBP", minorUnits: faker.number.int({min:0, max:faker.number.int({min:0, max:100})})},
    effectiveBalance: {currency: "GBP", minorUnits: faker.number.int({min:0, max:100})},
    pendingTransactions: {currency: "GBP", minorUnits: faker.number.int({min:0, max:100})},
    acceptedOverdraft: {currency: "GBP", minorUnits: faker.number.int({min:0, max:100})},
    amount: {currency: "GBP", minorUnits: faker.number.int({min:0, max:100})},
    totalClearedBalance: {currency: "GBP", minorUnits: faker.number.int({min:0, max:100})},
    totalEffectiveBalance: {currency: "GBP", minorUnits: faker.number.int({min:0, max:100})}
  }
}