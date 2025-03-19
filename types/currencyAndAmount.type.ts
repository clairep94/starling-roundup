import { faker } from '@faker-js/faker'

/**
 * 	Representation of money
 */
export type CurrencyAndAmount = {
  currency: string, //eg.GBP
  minorUnits: number, //eg. 123456 for £1234.56
}

export function generateMockCurrencyAndAmount(): CurrencyAndAmount {
  return {
    currency: "GBP", 
    minorUnits: faker.number.int({min:0, max:100000})
  }
}