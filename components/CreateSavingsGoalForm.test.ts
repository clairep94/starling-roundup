import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useSavingsGoalsStore } from '../store/savingsGoals'
import { useNotificationsStore } from '../store/notifications'
import CreateSavingsGoalForm from './CreateSavingsGoalForm.vue'
import { generateMockToken } from '../types/auth.type'

vi.mock('nuxt/app', () => ({
  navigateTo: vi.fn()
}))

function factory(): VueWrapper<any>{
  return shallowMount(CreateSavingsGoalForm, {
    global: {
      plugins: [createTestingPinia()]
    },
  })
}

describe('Create Savings Goal Form', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  it('should render the right title', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-test="create-savings-space-form-title"]').exists()).toBe(true)
  })
  it('should render the right button', () => {
    const wrapper = factory()
    expect(wrapper.find('button').text()).toBe('Submit')
  })
  it('should render a form field for the space name', () => {
    const wrapper = factory()
    const inputs = wrapper.findAll('input')
    const input = inputs[0]
    expect(input.attributes('id')).toBe('space-name')
    expect(input.attributes('placeholder')).toBe('Eg. Trip to Paris')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('required')).toBe("")

    const labels = wrapper.findAll('label')
    const label = labels[0]
    expect(label.attributes('for')).toBe('space-name')
    expect(label.text()).toContain('Name')
    expect(label.text()).toContain('Required')
  })
  it('should render a form field for the space target', () => {
    const wrapper = factory()
    const inputs = wrapper.findAll('input')
    const input = inputs[1]
    expect(input.attributes('id')).toBe('space-target')
    expect(input.attributes('placeholder')).toBe('Eg. 123.45')
    expect(input.attributes('type')).toBe('number')

    const labels = wrapper.findAll('label')
    const label = labels[1]
    expect(label.attributes('for')).toBe('space-target')
    expect(label.text()).toContain('Target Amount')
    expect(label.text()).not.toContain('Required')
  })

  it('should attempt to create a space when the user clicks', async () => {
    const wrapper = factory()
    const savingsStore = useSavingsGoalsStore()
    const notificationsStore = useNotificationsStore()
    const { navigateTo } = await import('nuxt/app')

    vi.spyOn(savingsStore, 'createSavingsGoal').mockResolvedValue(true)
    vi.spyOn(notificationsStore, 'addNotification')

    await wrapper.find('#space-name').setValue('some space')
    await wrapper.find('#space-target').setValue('123.45')
    await wrapper.find('form').trigger('submit')

    expect(savingsStore.createSavingsGoal).toHaveBeenCalled()
    expect(notificationsStore.addNotification).toHaveBeenCalledWith({
      variant: 'success',
      message: 'Successfully created new savings space.'
    })
    expect(navigateTo).toHaveBeenCalledWith('/spaces')
  })

  it('should disable the button when loading create space', async () => {
    const wrapper = factory()
    const savingsStore = useSavingsGoalsStore()
    savingsStore.isLoadingCreateSavingsGoal = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})