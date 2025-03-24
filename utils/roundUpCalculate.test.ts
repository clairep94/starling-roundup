import { describe, it, expect } from 'vitest'
import { findRoundUpAmount, calculateRoundUpFromTransactionFeed, isEligibleForRoundup } from './roundUpCalculate'

// Test data
const transactionFeedList = [
  { amount: { currency: 'GBP', minorUnits: 123 } },
  { amount: { currency: 'GBP', minorUnits: 450 } },
  { amount: { currency: 'GBP', minorUnits: 999 } },
  { amount: { currency: 'GBP', minorUnits: 1 } },
]

describe('findRoundUpAmount', () => {
  it('should return the correct round-up amount for a transaction', () => {
    expect(findRoundUpAmount({ currency: 'GBP', minorUnits: 123 })).toBe(77)
    expect(findRoundUpAmount({ currency: 'GBP', minorUnits: 450 })).toBe(50)
    expect(findRoundUpAmount({ currency: 'GBP', minorUnits: 999 })).toBe(1)
    expect(findRoundUpAmount({ currency: 'GBP', minorUnits: 1 })).toBe(99)
  })

  it('should return 0 when the amount is already a round number', () => {
    expect(findRoundUpAmount({ currency: 'GBP', minorUnits: 100 })).toBe(0)
    expect(findRoundUpAmount({ currency: 'GBP', minorUnits: 500 })).toBe(0)
  })
})

describe('calculateRoundUpFromTransactionFeed', () => {
  it('should correctly calculate the total round-up amount from a transaction feed', () => {
    expect(calculateRoundUpFromTransactionFeed(transactionFeedList)).toBe(227)
  })

  it('should return 0 for an empty transaction feed', () => {
    expect(calculateRoundUpFromTransactionFeed([])).toBe(0)
  })
})

describe('isEligibleForRoundup', () => {
  it('should return false if item direction is IN or an INTERNAL_TRANSFER', () => {
    expect(isEligibleForRoundup({direction: 'IN'})).toBe(false)
    expect(isEligibleForRoundup({source: 'INTERNAL_TRANSFER'})).toBe(false)
    expect(isEligibleForRoundup({direction: 'OUT', source: 'INTERNAL_TRANSFER'})).toBe(false)
    expect(isEligibleForRoundup({direction: 'IN', source: 'NOT_INTERNAL_TRANSFER'})).toBe(false)
    expect(isEligibleForRoundup({direction: 'IN', source: 'INTERNAL_TRANSFER'})).toBe(false)
  })
  it('should return true if item direction is OUT & item is not an internal transfer', () => {
    expect(isEligibleForRoundup({direction: 'OUT', source: 'NOT_INTERNAL_TRANSFER'})).toBe(true)
  })
})