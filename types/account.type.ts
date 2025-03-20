import { faker } from '@faker-js/faker'

export type Account = {
  accountUid: string,
  accountType: AccountType,
  defaultCategory: string, 
  currency: string,
  createdAt: string,
  name: string,
}

export type AccountType = 'PRIMARY' | 'ADDITIONAL' | 'LOAN' | 'FIXED_TERM_DEPOSIT' | 'SAVINGS'

export function generateMockAccount(overrides?: any): Account {
  let result = {
    accountUid: faker.string.uuid(),
    accountType: faker.helpers.arrayElement(['PRIMARY', 'ADDITIONAL', 'LOAN', 'FIXED_TERM_DEPOSIT', 'SAVINGS']),
    defaultCategory: faker.string.uuid(), 
    currency: faker.finance.currencyCode(),
    createdAt: faker.date.recent().toISOString(),
    name: faker.lorem.word(),
  }
  return {
    ...result,
    ...(overrides ? overrides : {}),
  }
}