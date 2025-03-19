import type { CurrencyAndAmount } from "./currencyAndAmount.type"

export type SavingsGoal = {
  savingsGoalUid: string,
  name: string,
  target: CurrencyAndAmount,
  totalSaved: CurrencyAndAmount,
  savedPercentage: number,
  state: 'CREATING' | 'ACTIVE' |  'ARCHIVING' | 'ARCHIVED' | 'RESTORING' | 'PENDING'
}

export type SavingsGoals = {
  savingsGoalsList: SavingsGoal[]
}

export type SavingsGoalRequest = {
  name: string,
  currency: string,
  target?: CurrencyAndAmount,
  base64EncodedPhoto?: string
}

export type TopUpRequest = {
  amount: CurrencyAndAmount
}