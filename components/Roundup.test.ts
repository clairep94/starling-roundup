import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useSavingsGoalsStore } from '../store/savingsGoals'
import { useAccountsStore } from '../store/accounts'
import Roundup from './Roundup.vue'
import { generateFeedItem, type FeedItem } from '../types/feedItem.type'
import { generateMockAccount } from '../types/account.type'

function factory(selectedTransactions: FeedItem[], allPotentialTransactions: FeedItem[], isLoadingFeed: boolean, isSelectingRoundupTransactions: boolean): VueWrapper<any> {
  return shallowMount(Roundup, {
    props: {
      selectedTransactions,
      allPotentialTransactions,
      isLoadingFeed,
      isSelectingRoundupTransactions
    },
    global: {
      plugins: [createTestingPinia({stubActions: false})],
    },
  })
}
describe('Roundup', () => {
  let wrapper: VueWrapper<any>
  let savingsGoalsStore: ReturnType<typeof useSavingsGoalsStore>
  let accountsStore: ReturnType<typeof useAccountsStore>

  describe('and when the component mounts', () => {
    beforeEach(() => {
      wrapper = factory(
        [],
        [],
        false,
        false
      )
      savingsGoalsStore = useSavingsGoalsStore()
      accountsStore = useAccountsStore()
      accountsStore.accounts = [generateMockAccount()]
    })
    it('should display the right title', () => {
      expect(wrapper.find('[data-test="roundup-title"]').text()).toBe('Your Potential Roundup')
    })
    it('should display the show-spaces-for-transfer button', () => {
      const button = wrapper.find('[data-test="show-spaces-for-transfer-button"]')
      expect(button.text()).toBe('Perform transfer')
      expect(button.classes()).toContain('bg-button-teal')
    })
    it('should not display the spaces-for-transfer', () => {
      expect(wrapper.find('[data-test="spaces-for-transfer"]').exists()).toBe(false)
    })
    it('should emit openSelectingRoundupTransactions when the button is clicked', async () => {
      await wrapper.find('[data-test="show-spaces-for-transfer-button"]').trigger('click')
      await wrapper.vm.$nextTick()

      console.log(wrapper.emitted())
      expect(wrapper.emitted().openSelectingRoundupTransactions).toBeTruthy()
      expect(wrapper.emitted().closeSelectingRoundupTransactions).toBeFalsy()
    })
  })

  describe('and when isSelectingRoundupTransactions is true', () => {
    beforeEach(() => {
      wrapper = factory(
        [],
        [],
        false,
        true
      )
      savingsGoalsStore = useSavingsGoalsStore()
      accountsStore = useAccountsStore()
      accountsStore.accounts = [generateMockAccount()]
    })
    it('should display the cancel transfer button', async () => {
      const button = wrapper.find('[data-test="show-spaces-for-transfer-button"]')
      expect(button.text()).toBe('Cancel')
      expect(button.classes()).toContain('bg-gray-400')
    })
    it('should display the spaces for transfer', async () => {
      expect(wrapper.find('[data-test="spaces-for-transfer"]').exists()).toBe(true)
    })
    it('should emit openSelectingRoundupTransactions when the button is clicked', async () => {
      await wrapper.find('[data-test="show-spaces-for-transfer-button"]').trigger('click')
      await wrapper.vm.$nextTick()

      console.log(wrapper.emitted())
      expect(wrapper.emitted().openSelectingRoundupTransactions).toBeFalsy()
      expect(wrapper.emitted().closeSelectingRoundupTransactions).toBeTruthy()
    })
  })

  describe.skip('and when loading transactions is true', () => {
    beforeEach(() => {
      wrapper = factory(
        [],
        true
      )
      savingsGoalsStore = useSavingsGoalsStore()
      accountsStore = useAccountsStore()
      accountsStore.accounts = [generateMockAccount()]
    })
    it('should display the loading graphic', () => {
      expect(wrapper.find('[data-test="loading-transactions"]').exists()).toBe(true)
    })
    it('should not display the roundup amount', () => {
      expect(wrapper.find('[data-test="roundup-amount"]').exists()).toBe(false)
    })
  })
  describe.skip('and when loading transactions is false, and items are empty', () => {
    beforeEach(() => {
      wrapper = factory(
        [],
        false
      )
      savingsGoalsStore = useSavingsGoalsStore()
      accountsStore = useAccountsStore()
      accountsStore.accounts = [generateMockAccount({currency: 'GBP'})]
    })
    it('should not display the loading graphic', () => {
      expect(wrapper.find('[data-test="loading-transactions"]').exists()).toBe(false)
    })
    it('should display the roundup amount as 0', () => {
      expect(wrapper.find('[data-test="roundup-amount"]').text()).toBe('£0.00')
    })
  })
  describe.skip('and when loading transactions is false, and items are not empty', () => {
    beforeEach(() => {
      wrapper = factory(
        [generateFeedItem({amount:{currency:'GBP', minorUnits: 99}}), generateFeedItem({amount:{currency:'GBP', minorUnits: 99}})],
        false
      )
      savingsGoalsStore = useSavingsGoalsStore()
      accountsStore = useAccountsStore()
      accountsStore.accounts = [generateMockAccount({currency: 'GBP'})]
    })
    it('should not display the loading graphic', () => {
      expect(wrapper.find('[data-test="loading-transactions"]').exists()).toBe(false)
    })
    it('should display the roundup amount', () => {
      expect(wrapper.find('[data-test="roundup-amount"]').text()).toBe('£0.02')
    })
  })
})