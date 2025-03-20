import { describe, it, expect } from 'vitest'
import { appendStartTime, appendEndTime } from './setStartEndDateTimes'

describe('appendStartTime', () => {
  it('should append to a date string without an existing time', () => {
    expect(appendStartTime('2025-01-03')).toBe('2025-01-03T00:00:00.000Z')
  })
  it('should overwrite to a date string with an existing time', () => {
    expect(appendStartTime('2025-01-03T01:23:45.000Z')).toBe('2025-01-03T00:00:00.000Z')
  })
})

describe('appendEndTime', () => {
  it('should append to a date string without an existing time', () => {
    expect(appendEndTime('2025-01-03')).toBe('2025-01-03T23:59:59.999Z')
  })
  it('should overwrite to a date string with an existing time', () => {
    expect(appendEndTime('2025-01-03T01:23:45.000Z')).toBe('2025-01-03T23:59:59.999Z')
  })
})