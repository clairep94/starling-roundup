import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { appendStartTime, appendEndTime } from '../utils/setStartEndDateTimes'

export const useDateRangeStore = defineStore('dateRange', () => {
  const currentDate = new Date()
  const defaultStart = appendStartTime(new Date(currentDate.setDate(currentDate.getDate() - 7)).toISOString())
  const defaultEnd = appendEndTime(new Date().toISOString())

  const selectedStart = ref<string>(defaultStart)
  const selectedEnd = ref<string>(defaultEnd)

  /**
   * Set new selected start and end with appended times
   * @param start ISO string
   * @param end ISO string
   */
  function setDateRange(start: string, end: string) {
    selectedStart.value = appendStartTime(start)
    selectedEnd.value = appendEndTime(end)
  }

  /**
   * Check system date again and reset with default time range (relative 7 days)
   */
  function resetDateRange() {
    const newCurrentDate = new Date()
    const newDefaultStart = appendStartTime(new Date(newCurrentDate.setDate(newCurrentDate.getDate()-7)).toISOString())
    const newDefaultEnd = appendEndTime(new Date().toISOString())
    selectedStart.value = newDefaultStart
    selectedEnd.value = newDefaultEnd
  }

  return {
    selectedStart,
    selectedEnd,
    setDateRange,
    resetDateRange,
  }
})