import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import SavingsGoalTotal from './SavingsGoalTotal.vue'
import { generateMockSavingsGoal, type SavingsGoal } from '../types/savingsGoal.type';
import { createTestingPinia } from '@pinia/testing'

vi.mock('nuxt/app', () => ({
  navigateTo: vi.fn()
}))

function factory(props): VueWrapper<any>{
  return shallowMount(SavingsGoalTotal, {
    props: props,
    global: {
      plugins: [createTestingPinia({stubActions: false})]
    },
  })
}

describe('Savings Goal Total', () => {
  let wrapper: VueWrapper<any>
  let savingsGoals: SavingsGoal[]

  describe('when the component mounts', () => {
    beforeEach(() => {
      wrapper = factory(
        {
          savingsGoals: [],
          isLoadingSavingsGoals: false,
          currency: 'GBP'
        }
      )
    })
    it('should display the correct title', () => {
      expect(wrapper.find('[data-test="savings-goal-total-title"]').text()).toBe('Total amount held in Spaces')
    })
    it('should display the correct button', () => {
      expect(wrapper.find('[data-test="navigate-to-create-space-button"]').text()).toBe('Create a new space')
    })
    it('should navigate to the create space button when the user clicks', async() => {
      const { navigateTo } = await import('nuxt/app')
      await wrapper.find('button').trigger('click')
      expect(navigateTo).toHaveBeenCalledWith('/spaces/create')
    })
  })

  describe('when the savings goals are loading', () => {
    beforeEach(() => {
      wrapper = factory(
        {
          savingsGoals: [],
          isLoadingSavingsGoals: true,
          currency: 'GBP'
        }
      )
    })
    it('should only display the loading graphic', () => {
      expect(wrapper.find('[data-test="loading-savings-goals"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="savings-goals-total"]').exists()).toBeFalsy()
    })
  })
  describe('when the savings goals are finished loading, but savings goals are empty', () => {
    beforeEach(() => {
      wrapper = factory(
        {
          savingsGoals: [],
          isLoadingSavingsGoals: false,
          currency: 'GBP'
        }
      )
    })
    it('should only display the savings goal', () => {
      expect(wrapper.find('[data-test="loading-savings-goals"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="savings-goals-total"]').exists()).toBeTruthy()
    })
    it('should show 0 as the savings goal total', () => {
      expect(wrapper.find('[data-test="savings-goals-total"]').text()).toBe('£0.00')
    })
  })
  describe('when the savings goals are finished loading, and there are savings goals', () => {
    beforeEach(() => {
      wrapper = factory(
        {
          savingsGoals: [
            generateMockSavingsGoal({totalSaved: {currency: 'GBP', minorUnits: 100}}),
            generateMockSavingsGoal({totalSaved: {currency: 'GBP', minorUnits: 1000}})
          ],
          isLoadingSavingsGoals: false,
          currency: 'GBP'
        }
      )
    })
    it('should only display the savings goal', () => {
      expect(wrapper.find('[data-test="loading-savings-goals"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="savings-goals-total"]').exists()).toBeTruthy()
    })
    it('should show 0 as the savings goal total', () => {
      expect(wrapper.find('[data-test="savings-goals-total"]').text()).toBe('£11.00')
    })
  })
})