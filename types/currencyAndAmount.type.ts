/**
 * 	Representation of money
 */
export type CurrencyAndAmount = {
  currency: string, //eg.GBP
  minorUnits: number, //eg. 123456 for £1234.56
}