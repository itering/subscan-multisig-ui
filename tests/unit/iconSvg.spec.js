import { mount } from '@vue/test-utils'
import IconSvg from '@/views/Components/Icon-svg.vue'

describe('IconSvg', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(IconSvg)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
