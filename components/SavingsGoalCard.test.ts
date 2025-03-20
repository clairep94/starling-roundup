import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import SavingsGoalCard from './SavingsGoalCard.vue'
import { generateMockSavingsGoal, type SavingsGoal } from '../types/savingsGoal.type'

function factory(goal:SavingsGoal): VueWrapper<any>{
  return shallowMount(SavingsGoalCard, {
    props:{
      goal
    }
  })
}

describe('Savings Goal Card', () => {
  let wrapper: VueWrapper<any>
  let goal:SavingsGoal

  describe('if the goal does not have a target', () => {
    beforeEach(() => {
      wrapper = factory({
        savingsGoalUid: 'some_uuid',
        name: 'some goal',
        totalSaved: { currency: 'GBP', minorUnits: 1000},
        state: "ACTIVE"
      })
    })
    it('should display an image', () => {
      expect(wrapper.find('img').attributes('src')).toBe('https://picsum.photos/seed/some goal/100/100')
    })
    it('should display the goal name', () => {
      expect(wrapper.find('[data-test="savings-goal-name"]').text()).toBe('some goal')
    })
    it('should not display the goal target', () => {
      expect(wrapper.find('[data-test="savings-goal-target"]').exists()).toBeFalsy()
    })

    it('should display the goal amount', () => {
      expect(wrapper.find('[data-test="savings-goal-total-saved"]').text()).toBe('£10.00')
    })
    it('should not display the percentage saved', () => {
      expect(wrapper.find('[data-test="savings-goal-percentage-saved"]').exists()).toBeFalsy()
    })
  })
  describe('if the goal has a target and the amount saved is 0', () => {
    beforeEach(() => {
      wrapper = factory({
        savingsGoalUid: 'some_uuid',
        name: 'some goal',
        totalSaved: { currency: 'GBP', minorUnits: 0},
        state: "ACTIVE",
        target: { currency: 'GBP', minorUnits: 10000},
        savedPercentage: 0
      })
    })
    it('should display an image', () => {
      expect(wrapper.find('img').attributes('src')).toBe('https://picsum.photos/seed/some goal/100/100')
    })
    it('should display the goal name', () => {
      expect(wrapper.find('[data-test="savings-goal-name"]').text()).toBe('some goal')
    })
    it('should display the goal target', () => {
      expect(wrapper.find('[data-test="savings-goal-target"]').text()).toBe('£100.00')
    })

    it('should display the goal amount', () => {
      expect(wrapper.find('[data-test="savings-goal-total-saved"]').text()).toBe('£0.00')
    })
    it('should display the percentage saved', () => {
      expect(wrapper.find('[data-test="savings-goal-percentage-saved"]').text()).toBe('0%')
    })
  })
  describe('if the goal has a target and the amount saved is more than 0', () => {
    beforeEach(() => {
      wrapper = factory({
        savingsGoalUid: 'some_uuid',
        name: 'some goal',
        totalSaved: { currency: 'GBP', minorUnits: 100},
        state: "ACTIVE",
        target: { currency: 'GBP', minorUnits: 10000},
        savedPercentage: 1
      })
    })
    it('should display an image', () => {
      expect(wrapper.find('img').attributes('src')).toBe('https://picsum.photos/seed/some goal/100/100')
    })
    it('should display the goal name', () => {
      expect(wrapper.find('[data-test="savings-goal-name"]').text()).toBe('some goal')
    })
    it('should display the goal target', () => {
      expect(wrapper.find('[data-test="savings-goal-target"]').text()).toBe('£100.00')
    })

    it('should display the goal amount', () => {
      expect(wrapper.find('[data-test="savings-goal-total-saved"]').text()).toBe('£1.00')
    })
    it('should display the percentage saved', () => {
      expect(wrapper.find('[data-test="savings-goal-percentage-saved"]').text()).toBe('1%')
    })
  })
})