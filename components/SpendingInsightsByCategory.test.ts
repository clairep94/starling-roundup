import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useSpendingInsightsStore } from '../store/spendingInsights'
import SpendingInsightsByCategory from './SpendingInsightsByCategory.vue'
import { generateMockSpendingCategorySummary } from '../types/spendingInsights.type'
import { formatCurrencyAmount } from '../utils/formatData'
import DoughnutChart from './DoughnutChart.vue'

const DoughnutChartStub = {
  name: 'doughnut-chart',
  template: '<div data-test="doughnut-chart"><slot/></div>',
  props: ['data']
}

function factory(
  dateRange?: {
    summaryStartPeriodInclusive: string,
    summaryEndPeriodExclusive: string
  }): VueWrapper<any> {
  return shallowMount(SpendingInsightsByCategory, {
    global: {
      stubs: {DoughnutChart: DoughnutChartStub},
      plugins: [createTestingPinia({stubActions: false})],
    },
    props: dateRange
  })
}

describe('Spending Insights by Category', () => {
  let wrapper: VueWrapper<any>
  let spendingInsightsStore: ReturnType<typeof useSpendingInsightsStore>

  describe('and when the componnent mounts', () => {
    beforeEach(() => {
      wrapper = factory(
        {
          summaryStartPeriodInclusive: 'abc',
          summaryEndPeriodExclusive: 'xyz'
        }
      )
      spendingInsightsStore = useSpendingInsightsStore()
    })
    it('should call fetchSpendingInsightsByCategory with the dateRange', () => {
      expect(spendingInsightsStore.fetchSpendingInsightsByCategory).toHaveBeenCalled()
    })
    it('should display the correct title', () => {
      expect(wrapper.find('[data-test="spending-insights-title"]').text()).toBe('Your Spending by Category')
    })
  })
  describe('and when data is finished loading', () => {
    beforeEach(() => {
      wrapper = factory()
      spendingInsightsStore = useSpendingInsightsStore()
      spendingInsightsStore.isLoadingSpendingInsightsByCategory = true
    })
    it('should load the spending-insights-loading graphic only', () => {
      expect(wrapper.find('[data-test="spending-insights-loading"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="doughnut"]').exists()).toBe(false)
    })
  })
  describe('and when data is finished loading but there is no data', () => {
    beforeEach(() => {
      wrapper = factory(
        {
          summaryStartPeriodInclusive: 'abc',
          summaryEndPeriodExclusive: 'xyz'
        }
      )
      spendingInsightsStore = useSpendingInsightsStore()
      spendingInsightsStore.isLoadingSpendingInsightsByCategory = false
    })
    it('should load the doughnut graphic', () => {
      expect(wrapper.find('[data-test="doughnut"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="spending-insights-loading"]').exists()).toBe(false)
    })
    it('should display no data for the provided date range', () => {
      expect(wrapper.find('[data-test="center-info-summary"]').text()).toContain('No data available')
    })
  })
  describe('and when data is finished loading but there is data', () => {
    const mockSpendingInsights = generateMockSpendingCategorySummary({
      period: '01/2025',
      currency: 'GBP',
      netSpend: 100.00,
      breakdown: [
        { netSpend: 100.00, netDirection: 'IN', spendingCategory: 'SOME_PAYMENT', transactionCount: 3 },
        { netSpend: 200.00, netDirection: 'OUT', spendingCategory: 'SALARY', transactionCount: 1 }

      ]
    })
    beforeEach(() => {
      wrapper = factory(
      )
      spendingInsightsStore = useSpendingInsightsStore()
      spendingInsightsStore.isLoadingSpendingInsightsByCategory = false
      spendingInsightsStore.spendingInsightsSummaryByCategory = mockSpendingInsights
    })
    it('should load the doughnut graphic', () => {
      expect(wrapper.find('[data-test="doughnut"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="spending-insights-loading"]').exists()).toBe(false)
    })
    it('should display the correct net spend', () => {
      expect(wrapper.find('[data-test="center-info-summary"]').text()).toContain('£100.00')
    })
    it('should pass the correct props to the DoughnutChart', () => {
      expect(wrapper.findComponent(DoughnutChart).props()).toEqual({
        data: {
          datasets: [
            {data: [100, -200], label: 'Total GBP'},
            {data: [3, 1], label: 'Number of Transactions'},
          ],
          labels: ['Some_payment', 'Salary']
        },
        optionOverrides: undefined
      })
    })
  })

  describe('and when data is finished loading but there is no date range prop', () => {
    const mockSpendingInsights = generateMockSpendingCategorySummary({
      period: '01/2025',
      currency: 'GBP',
      netSpend: 100.00,
      breakdown: [
        { netSpend: 100.00, netDirection: 'IN', spendingCategory: 'SOME_PAYMENT', transactionCount: 3 },
        { netSpend: 200.00, netDirection: 'OUT', spendingCategory: 'SALARY', transactionCount: 1 }

      ]
    })
    beforeEach(() => {
      wrapper = factory()
      spendingInsightsStore = useSpendingInsightsStore()
      spendingInsightsStore.isLoadingSpendingInsightsByCategory = false
      spendingInsightsStore.spendingInsightsSummaryByCategory = mockSpendingInsights
    })
    it('should display the current month', () => {
      expect(wrapper.find('[data-test="center-info-summary"]').text()).toContain('for 01/2025')
    })
  })

  describe.skip('and when data is finished loading but there is a date range prop', () => {
    const mockSpendingInsights = generateMockSpendingCategorySummary({
      period: '01/2025',
      currency: 'GBP',
      netSpend: 100.00,
      breakdown: [
        { netSpend: 100.00, netDirection: 'IN', spendingCategory: 'SOME_PAYMENT', transactionCount: 3 },
        { netSpend: 200.00, netDirection: 'OUT', spendingCategory: 'SALARY', transactionCount: 1 }

      ]
    })
    beforeEach(() => {
      wrapper = factory({
        summaryStartPeriodInclusive: 'abc',
        summaryEndPeriodExclusive: 'xyz'
      })
      spendingInsightsStore = useSpendingInsightsStore()
      spendingInsightsStore.isLoadingSpendingInsightsByCategory = false
      spendingInsightsStore.spendingInsightsSummaryByCategory = mockSpendingInsights
    })
    it('should display the current month', () => {
      expect(wrapper.find('[data-test="center-info-summary"]').text()).toContain('between abc-xyz')
    })
  })
})