import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import NavigationBar from './NavigationBar.vue'
import NavigationBarLink from './NavigationBarLink.vue'
import NavigationBarProfile from './NavigationBarProfile.vue'
import LogoutButton from './LogoutButton.vue'

describe('NavigationBar.vue', () => {
  let wrapper: VueWrapper
  beforeEach(()=>{
    wrapper = shallowMount(NavigationBar)
  })
  it('renders the user profile div', () => {
    expect(wrapper.findComponent(NavigationBarProfile).exists()).toBe(true)
  })
  it('renders the correct sitelinks', () => {
    const links = wrapper.findAllComponents(NavigationBarLink)
    expect(links).toHaveLength(2)
    expect(links[0].props('link').title).toBe('Home')
    expect(links[1].props('link').title).toBe('Spaces')
  })
  it('renders the logout button', () => {
    expect(wrapper.findComponent(LogoutButton).exists()).toBe(true)
  })
  it('renders the starling logo', () => {
    expect(wrapper.find('[data-test="starling-logo"]').exists()).toBe(true)    
  })
})
