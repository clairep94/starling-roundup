import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import TransactionsList from './TransactionsList.vue'
import TransactionFeedItem from './TransactionFeedItem.vue'
import { generateFeedItem, type FeedItem } from '../types/feedItem.type'

function factory(isLoading:boolean, items:FeedItem[], selectedTransactions:FeedItem[], isSelectingRoundupTransactions:boolean): VueWrapper<any>{
  return shallowMount(TransactionsList, {
    props: {
      isLoading, items, selectedTransactions, isSelectingRoundupTransactions, currentDate: '2025-01-01'
    }
  })
}

describe('Transaction List', () => {
  let wrapper: VueWrapper<any>
  let items: FeedItem[]

  describe('and when isLoading is true', () => {
    beforeEach(() => {
      wrapper = factory(true, [], [], false)
    })
    it('should only display the loading transactions graphic', () => {
      expect(wrapper.find('[data-test="loading-transactions"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="no-transactions-found-message"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="transaction-feed-list"]').exists()).toBeFalsy()
    })
  })
  describe('and when isLoading is false but items are empty', () => {
    beforeEach(() => {
      wrapper = factory(false, [], [], false)
    })
    it('should only display the no-transactions-found graphic', () => {
      expect(wrapper.find('[data-test="loading-transactions"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="no-transactions-found-message"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="transaction-feed-list"]').exists()).toBeFalsy()
    })
  })
  describe('and when isLoading is false and there are items, and isSelectingRoundupTransactions is true', () => {
    const items = [ 
      generateFeedItem({direction: 'OUT', userNote: undefined}), //eligible and selected
      generateFeedItem({direction: 'OUT', userNote: undefined}), //eligible and not selected
      generateFeedItem({direction: 'OUT'})  //not eligible
    ]
    const selectedItems = [items[0]]
    beforeEach(() => {
      wrapper = factory(false, items, selectedItems, false)
    })
    it('should only display the no-transactions-found graphic', () => {
      expect(wrapper.find('[data-test="loading-transactions"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="no-transactions-found-message"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="transaction-feed-list"]').exists()).toBeTruthy()
    })
    it('should display a Feed Item component for each item', () => {
      expect(wrapper.findAllComponents('transaction-feed-item-stub').length).toBe(3)
    })
    it('should not display any checkboxes', () => {
      expect(wrapper.findAll('input[type="checkbox"]').length).toBe(0)
    })
    it('should not display the select and deselect all button', () => {
      const selectButton = wrapper.find('[data-test="select-all-button"]')
      const deselectButton = wrapper.find('[data-test="deselect-all-button"]')
      expect(deselectButton.exists()).toBe(false)
      expect(selectButton.exists()).toBe(false)
    })
  })

  describe('and when isLoading is false and there are items, and isSelectingRoundupTransactions is true', () => {
    const items = [ 
      generateFeedItem({direction: 'OUT', userNote: undefined}), //eligible and selected
      generateFeedItem({direction: 'OUT', userNote: undefined}), //eligible and not selected
      generateFeedItem({direction: 'OUT'})  //not eligible
    ]
    const selectedItems = [items[0]]

    beforeEach(() => {
      wrapper = factory(false, items, selectedItems, true)
    })
    it('should only display the no-transactions-found graphic', () => {
      expect(wrapper.find('[data-test="loading-transactions"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="no-transactions-found-message"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="transaction-feed-list"]').exists()).toBeTruthy()
    })
    it('should display a Feed Item component for each item', () => {
      expect(wrapper.findAllComponents('transaction-feed-item-stub').length).toBe(3)
    })
    it('should display a checkbox for each eligible item', () => {
      expect(wrapper.findAll('input[type="checkbox"]').length).toBe(2)
    })
    it('should display the checkboxes as matching the selected status of each item', () => {
      const checkboxes = wrapper.findAll('input[type="checkbox"]')
      expect(checkboxes[0].element.checked).toBe(true)
      expect(checkboxes[1].element.checked).toBe(false)
    })
    it('should emit to update the selected transactions when the user checks an input', async () => {
      const checkboxes = wrapper.findAll('input[type="checkbox"]');
      expect(checkboxes[1].element.checked).toBe(false);
    
      await checkboxes[1].setValue(true); //simulate click
    
      expect(wrapper.emitted('update:selectedTransactions')).toBeTruthy();     
      const emittedEvents = wrapper.emitted('update:selectedTransactions');
      expect(emittedEvents[0][0]).toHaveLength(2);
    });
    it('should emit the right events when the user clicks the select and deselect all button', async () => {
      const selectButton = wrapper.find('[data-test="select-all-button"]')
      const deselectButton = wrapper.find('[data-test="deselect-all-button"]')
      expect(deselectButton.exists()).toBe(true)
      expect(selectButton.exists()).toBe(true)

      const checkboxes = wrapper.findAll('input[type="checkbox"]');
      expect(checkboxes[0].element.checked).toBe(true)
      expect(checkboxes[1].element.checked).toBe(false);
      
      await deselectButton.trigger('click')
      const emittedEvents = wrapper.emitted('update:selectedTransactions');
      expect(emittedEvents[0][0]).toHaveLength(0);

      await selectButton.trigger('click')
      expect(emittedEvents[1][0]).toHaveLength(2);
    })
  })
})