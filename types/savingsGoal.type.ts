import type { CurrencyAndAmount } from './feedItem.type'

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