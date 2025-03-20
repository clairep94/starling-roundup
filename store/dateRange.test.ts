import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia';
import { useDateRangeStore } from './dateRange';

describe('DateRange Store', () => {
  let dateRangeStore: any;
  const mockDate = new Date('2025-03-20T12:00:00Z')

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initilisation', () => {
    it('should initialise with the selectedEnd as the end of today as default', () => {
      dateRangeStore = useDateRangeStore()
      expect(dateRangeStore.selectedEnd).toBe('2025-03-20T23:59:59.999Z')
    })
    it('should initialise with the selectedStart as the start of 7 days ago as default', () => {
      dateRangeStore = useDateRangeStore()
      expect(dateRangeStore.selectedStart).toBe('2025-03-13T00:00:00.000Z')
    })
  })

  describe('setDateRange', () => {
    it('should set the new selectedEnd with the end of the input end', () => {
      dateRangeStore = useDateRangeStore()
      dateRangeStore.setDateRange('2025-03-15T22:12:00.00Z', '2025-03-16T22:12:00.00Z')
      expect(dateRangeStore.selectedEnd).toBe('2025-03-16T23:59:59.999Z')
    })
    it('should set the new selectedStart with the start of the input start', () => {
      dateRangeStore = useDateRangeStore()
      dateRangeStore.setDateRange('2025-03-15T22:12:00.00Z', '2025-03-16T22:12:00.00Z')
      expect(dateRangeStore.selectedStart).toBe('2025-03-15T00:00:00.000Z')
    })
  })

  describe('resetDateRange', () => {
    it('should reset the date', () => {
      dateRangeStore = useDateRangeStore()
      dateRangeStore.setDateRange('2025-03-15T22:12:00.00Z', '2025-03-16T22:12:00.00Z')
      dateRangeStore.resetDateRange()
      expect(dateRangeStore.selectedEnd).toBe('2025-03-20T23:59:59.999Z')
      expect(dateRangeStore.selectedStart).toBe('2025-03-13T00:00:00.000Z')
    })
    it('should reset the date with the new system date', () => {
      dateRangeStore = useDateRangeStore()
      vi.setSystemTime('2025-03-22T12:00:00Z')
      
      dateRangeStore.setDateRange('2025-03-15T22:12:00.00Z', '2025-03-16T22:12:00.00Z')
      dateRangeStore.resetDateRange()
      expect(dateRangeStore.selectedEnd).toBe('2025-03-22T23:59:59.999Z')
      expect(dateRangeStore.selectedStart).toBe('2025-03-15T00:00:00.000Z')
    })
  })
})