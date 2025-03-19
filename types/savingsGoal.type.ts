import { generateMockCurrencyAndAmount, type CurrencyAndAmount } from "./currencyAndAmount.type"
import { faker } from '@faker-js/faker'

export type SavingsGoal = {
  savingsGoalUid: string,
  name: string,
  target: CurrencyAndAmount,
  totalSaved: CurrencyAndAmount,
  savedPercentage: number,
  state: 'CREATING' | 'ACTIVE' |  'ARCHIVING' | 'ARCHIVED' | 'RESTORING' | 'PENDING'
}

export function generateMockSavingsGoal(overrides?:any){
  let result = {
    savingsGoalUid: faker.string.uuid(),
    name: faker.lorem.sentence(),
    target: generateMockCurrencyAndAmount(),
    totalSaved: generateMockCurrencyAndAmount(),
    savedPercentage: faker.number.int({min:0,max:100}),
  }
  return {
    ...result,
    ...(overrides ? overrides : {}),
  }
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