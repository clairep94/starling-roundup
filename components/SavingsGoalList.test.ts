import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import SavingsGoalsList from './SavingsGoalsList.vue'
import SavingsGoalCard from './SavingsGoalCard.vue'
import { generateMockSavingsGoal, type SavingsGoal } from '../types/savingsGoal.type'

function factory(isLoadingSavingsGoals:boolean, savingsGoals:SavingsGoal[]): VueWrapper<any>{
  return shallowMount(SavingsGoalsList, {
    props: {
      isLoadingSavingsGoals, savingsGoals
    }
  })
}

describe('SavingsGoalsList', () => {
  let wrapper: VueWrapper<any>;
  let savingsGoals: SavingsGoal[];

  describe('and when isLoadingSavingsGoals is true', () => {
    beforeEach(() => {
      wrapper = factory(true, []);
    });

    it('should display the loading savings goals graphic', () => {
      expect(wrapper.find('[data-test="loading-savings-goals"]').exists()).toBeTruthy();
      expect(wrapper.find('[data-test="no-savings-goals"]').exists()).toBeFalsy();
      expect(wrapper.find('[data-test="savings-goals"]').exists()).toBeFalsy();
    });
  });

  describe('and when isLoadingSavingsGoals is false but savingsGoals is empty', () => {
    beforeEach(() => {
      wrapper = factory(false, []);
    });

    it('should display the no savings goals message', () => {
      expect(wrapper.find('[data-test="loading-savings-goals"]').exists()).toBeFalsy();
      expect(wrapper.find('[data-test="no-savings-goals"]').exists()).toBeTruthy();
      expect(wrapper.find('[data-test="savings-goals"]').exists()).toBeFalsy();
    });
  });

  describe('and when isLoadingSavingsGoals is false and there are savings goals', () => {
    beforeEach(() => {
      savingsGoals = [generateMockSavingsGoal(), generateMockSavingsGoal()];
      wrapper = factory(false, savingsGoals);
    });

    it('should display the savings goals list', () => {
      expect(wrapper.find('[data-test="loading-savings-goals"]').exists()).toBeFalsy();
      expect(wrapper.find('[data-test="no-savings-goals"]').exists()).toBeFalsy();
      expect(wrapper.find('[data-test="savings-goals"]').exists()).toBeTruthy();
    });

    it('should render a SavingsGoalCard for each savings goal', () => {
      expect(wrapper.findAllComponents(SavingsGoalCard).length).toBe(2);
    });
  });
});
