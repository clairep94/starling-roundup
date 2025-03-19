import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import TransactionsList from './TransactionsList.vue'
import TransactionFeedItem from './TransactionFeedItem.vue'
import { generateFeedItem, type FeedItem } from '../types/feedItem.type'

function factory(isLoading:boolean, items:FeedItem[]): VueWrapper<any>{
  return shallowMount(TransactionsList, {
    props: {
      isLoading, items
    }
  })
}

describe('Transaction List', () => {
  let wrapper: VueWrapper<any>
  let items: FeedItem[]

  describe('and when isLoading is true', () => {
    beforeEach(() => {
      wrapper = factory(true, [])
    })
    it('should only display the loading transactions graphic', () => {
      expect(wrapper.find('[data-test="loading-transactions"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="no-transactions-found-message"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="transaction-feed-list"]').exists()).toBeFalsy()
    })
  })
  describe('and when isLoading is false but items are empty', () => {
    beforeEach(() => {
      wrapper = factory(false, [])
    })
    it('should only display the no-transactions-found graphic', () => {
      expect(wrapper.find('[data-test="loading-transactions"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="no-transactions-found-message"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="transaction-feed-list"]').exists()).toBeFalsy()
    })
  })
  describe('and when isLoading is false and there are items', () => {
    beforeEach(() => {
      wrapper = factory(false, [
        generateFeedItem(),
        generateFeedItem()
      ])
    })
    it('should only display the no-transactions-found graphic', () => {
      expect(wrapper.find('[data-test="loading-transactions"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="no-transactions-found-message"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="transaction-feed-list"]').exists()).toBeTruthy()
    })
    it('should display a Feed Item component for each item', () => {
      expect(wrapper.findAllComponents('transaction-feed-item-stub').length).toBe(2)
    })
  })
})