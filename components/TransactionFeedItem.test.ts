import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import TransactionFeedItem from './TransactionFeedItem.vue'
import { generateFeedItem, type FeedItem } from '../types/feedItem.type'
import { formatCurrencyAmount, formatUpperSnakeCaseToTitleString, extractTime } from "../utils/formatData";
import { findRoundUpAmount } from '../utils/roundUpCalculate';
import { createTestingPinia } from '@pinia/testing'

function factory(transactionFeedItem:FeedItem): VueWrapper<any>{
  return shallowMount(TransactionFeedItem, {
    props: {
      transactionFeedItem: transactionFeedItem
    },
    global: {
      plugins: [createTestingPinia({stubActions: false})]
    },
  })
}

describe('Transaction Feed Item', () => {
  let wrapper: VueWrapper<any>
  let item: FeedItem

  describe('when the component mounts', () => {
    beforeEach(() => {
      item = generateFeedItem({
        counterPartyName: "Hello World"
      })
      wrapper = factory(item)
    })
    it('should display the counterparty name', () => {
      expect(wrapper.find('[data-test="counter-party-name"]').text()).toBe("Hello World")
    })
    it('should display the formatted transaction time', () => {
      expect(wrapper.find('[data-test="transaction-time-and-category"]').text()).toContain(
        extractTime(item.settlementTime)
      )
    })
    it('should display the formatted spending category', () => {
      expect(wrapper.find('[data-test="transaction-time-and-category"]').text()).toContain(
        formatUpperSnakeCaseToTitleString(item.spendingCategory)
      )
    })
    it('should display an image for the counterparty', () => {
      expect(wrapper.find('[data-test="counterparty-image"]').attributes('src')).toBe(
        `https://picsum.photos/seed/${item.counterPartyName}/100/100`
      )
    })
  })

  describe('when the transaction is "IN"', () => {
    beforeEach(() => {
      item = generateFeedItem({
        direction: "IN"
      })
      wrapper = factory(item)
    })
    it('should display the formatted amount with a + symbol', () => {
      expect(wrapper.find('[data-test="amount"]').text()).toBe(`+${formatCurrencyAmount(item.amount)}`)
    })
    it('should display the amount in blue', () => {
      expect(wrapper.find('[data-test="amount"]').classes()).toContain('text-blue-700/70')
    })
    it('does not display the roundup amount', () => {
      expect(wrapper.find('[data-test="round-up-amount"]').exists()).toBeFalsy()
    })
  })

  describe('when the transaction is "OUT"', () => {
    beforeEach(() => {
      item = generateFeedItem({
        direction: "OUT"
      })
      wrapper = factory(item)
    })
    it('should display the formatted amount', () => {
      expect(wrapper.find('[data-test="amount"]').text()).toBe(`${formatCurrencyAmount(item.amount)}`)
    })
    it('should display the amount in black', () => {
      expect(wrapper.find('[data-test="amount"]').classes()).toContain('text-black/80')
    })
    it('should display the formatted roundup amount', () => {
      expect(wrapper.find('[data-test="round-up-amount"]').text()).toBe(formatCurrencyAmount({
        currency: 'GBP',
        minorUnits: findRoundUpAmount(item.amount)
      }))
    })
  })
})


