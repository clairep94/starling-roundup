import { faker } from '@faker-js/faker'

/**
 * 	Representation of money
 */
export type CurrencyAndAmount = {
  currency: string, //eg.GBP
  minorUnits: number, //eg. 123456 for £1234.56
}

export function generateMockCurrencyAndAmount(overrides?: any): CurrencyAndAmount {
  let result = {
    currency: "GBP", 
    minorUnits: faker.number.int({min:0, max:100000})
  }
  
  return {
    ...result,
    ...(overrides ? overrides : {}),
  }
}