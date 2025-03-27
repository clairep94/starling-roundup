import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useSavingsGoalsStore } from '../store/savingsGoals'
import { useNotificationsStore } from '../store/notifications'
import { useBalanceStore } from '../store/balance'
import { useTransactionFeedStore } from '../store/transactionFeed'
import { useDateRangeStore } from '../store/dateRange'
import SavingsGoalsForTransferList from './SavingsGoalsForTransferList.vue'
import { generateMockCurrencyAndAmount } from '../types/currencyAndAmount.type'
import { generateMockSavingsGoal } from '../types/savingsGoal.type'

function factory(): VueWrapper{
  return shallowMount(SavingsGoalsForTransferList, {
    props: {
      transferAmount: generateMockCurrencyAndAmount(),
    },
    global: {
      plugins: [createTestingPinia({stubActions: false})],
    },
  })
}

describe('Savings Goals for Transfer List', () => {
  let wrapper: VueWrapper<any>
  let savingsGoalsStore: ReturnType<typeof useSavingsGoalsStore>
  let notificationsStore: ReturnType<typeof useNotificationsStore>
  let balanceStore: ReturnType<typeof useBalanceStore>
  let transactionFeedStore: ReturnType<typeof useTransactionFeedStore>
  let dateRangeStore: ReturnType<typeof useDateRangeStore>

  describe('and when the component mounts', () => {
    beforeEach(() => {
      wrapper = factory()
      savingsGoalsStore = useSavingsGoalsStore()
    })

    it('should call to fetch savings goals', () => {
      expect(savingsGoalsStore.fetchSavingsGoals).toHaveBeenCalled()
    })
  })
  describe('and when savings goals are loading', () => {
    beforeEach(() => {
      wrapper = factory()
      savingsGoalsStore = useSavingsGoalsStore()
      savingsGoalsStore.isLoadingSavingsGoals = true
    })
    it('should show the loading overlay', () => {
      expect(wrapper.find('[data-test="loading-overlay"]').exists()).toBe(true)
    })
  })
  describe('and when transfer is loading', () => {
    beforeEach(() => {
      wrapper = factory()
      savingsGoalsStore = useSavingsGoalsStore()
      savingsGoalsStore.isLoadingTransferToSavingsGoal = true
    })
    it('should show the loading overlay', () => {
      expect(wrapper.find('[data-test="loading-overlay"]').exists()).toBe(true)
    })
  })
  describe('and when there are no savings goals', () => {
    beforeEach(() => {
      wrapper = factory()
      savingsGoalsStore = useSavingsGoalsStore()
      savingsGoalsStore.savingsGoals = []
    })
    it('should show the no savings goals message', () => {
      expect(wrapper.find('[data-test="no-savings-goals"]').exists()).toBe(true)
    })
    it('should not show any savings goals', () => {
      expect(wrapper.findAll('[data-test="savings-goal"]').length).toBe(0)
    })
  })
  describe('and when there are savings goals', () => {
    beforeEach(() => {
      wrapper = factory()
      savingsGoalsStore = useSavingsGoalsStore()
      savingsGoalsStore.savingsGoals = [generateMockSavingsGoal(), generateMockSavingsGoal(), generateMockSavingsGoal()]
    })
    it('should not show the no savings goals message', () => {
      expect(wrapper.find('[data-test="no-savings-goals"]').exists()).toBe(false)
    })
    it('should a savings goal card for each goal', () => {
      expect(wrapper.findAll('[data-test="savings-goal"]').length).toBe(3)
    })
  })
  describe('and when the user clicks on a savigns goal', () => {
    beforeEach(async() => {
      wrapper = factory()
      savingsGoalsStore = useSavingsGoalsStore()
      notificationsStore = useNotificationsStore()
      balanceStore = useBalanceStore()
      transactionFeedStore = useTransactionFeedStore()
      dateRangeStore = useDateRangeStore()
      
      savingsGoalsStore.savingsGoals = [generateMockSavingsGoal({savingsGoalUid: 'some-uid'})]
      vi.spyOn(savingsGoalsStore, 'transferToSavingsGoal').mockResolvedValue(true)
      dateRangeStore.selectedStart = 'some_start_date'
      dateRangeStore.selectedEnd = 'some_end_date'
      vi.spyOn(notificationsStore, 'addNotification')  
    })
    it('should call transferToSavingsGoal with the savings goals uuid', async () => {
      await wrapper.find('[data-test="savings-goal"]').trigger('click')
      await wrapper.find('[data-test="confirm-transfer-button"]').trigger('click')
      expect(savingsGoalsStore.transferToSavingsGoal).toHaveBeenCalled()
      expect(notificationsStore.addNotification).toHaveBeenCalledWith({
        message: "Successfully transferred roundup to savings goal: some-uid",
        variant: "success"
      })
      expect(savingsGoalsStore.fetchSavingsGoals).toHaveBeenCalled()
      expect(balanceStore.fetchBalance).toHaveBeenCalled()
      expect(transactionFeedStore.fetchTransactionFeed).toHaveBeenCalledWith('some_start_date','some_end_date')
    })
  })
})