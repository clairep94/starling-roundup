import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useBalanceStore } from '../store/balance'
import Balance from './Balance.vue'
import { generateMockBalance } from '../types/balance.type'
import { formatCurrencyAmount } from '../utils/formatData'

function balanceFactory(): VueWrapper<any> {
  return shallowMount(Balance, {
    global: {
      plugins: [createTestingPinia({stubActions: false})]
    },
  })
}

describe('Balance component', () => {
  let wrapper: VueWrapper<any>
  let balanceStore: ReturnType<typeof useBalanceStore>

  describe('and when the component mounts', () => {
    beforeEach(() => {
      wrapper = balanceFactory()
      balanceStore = useBalanceStore()
    })
    it('should call fetchBalance', () => {
      expect(balanceStore.fetchBalance).toHaveBeenCalled()
    })
    it('should display the correct title', () => {
      expect(wrapper.find('[data-test="balance-title"]').text()).toBe('Your Current Balance')
    })
  })

  describe('and when data is loading', () => {
    beforeEach(() => {
      wrapper = balanceFactory()
      balanceStore = useBalanceStore()
      balanceStore.isLoadingBalance = true
    })
    it('should show the loading graphic only', () => {
      expect(wrapper.find('[data-test="loading-balance"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="no-balance"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="balance-amount"]').exists()).toBeFalsy()
    })
  })

  describe('and when data is finished loading but there is no data', () => {
    beforeEach(() => {
      wrapper = balanceFactory()
      balanceStore = useBalanceStore()
      balanceStore.isLoadingBalance = false
    })
    it('should show the no-balance graphic only', () => {
      expect(wrapper.find('[data-test="loading-balance"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="no-balance"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="balance-amount"]').exists()).toBeFalsy()
    })
  })

  describe('and when data is finished loading but there is data', () => {
    beforeEach(() => {
      wrapper = balanceFactory()
      balanceStore = useBalanceStore()
      balanceStore.isLoadingBalance = false
      const mockBalance = generateMockBalance()
      balanceStore.balance = mockBalance
    })
    it('should show the no-balance graphic only', () => {
      expect(wrapper.find('[data-test="loading-balance"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="no-balance"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="balance-amount"]').exists()).toBeTruthy()
    })
    it('should display the formatted balance amount', () => {
      expect(wrapper.find('[data-test="balance-amount"]').text()).toBe(formatCurrencyAmount(balanceStore.effectiveBalance))
    })
  })
})