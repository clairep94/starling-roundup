import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import DateRangePicker from './DateRangePicker.vue';

const defaultProps = {
  startProp: '2024-03-10T12:34:56Z',
  endProp: '2024-03-15T07:08:09Z',
  currentDate: '2024-03-18',
  disabled: false
};

describe('DateRangePicker', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(DateRangePicker, {
      props: defaultProps
    });
  });

  it('renders with the initial start and end values normalised with the time removed', () => {
    const startInput = wrapper.find('#datepicker-range-start');
    const endInput = wrapper.find('#datepicker-range-end');
    
    expect(startInput.exists()).toBe(true);
    expect(endInput.exists()).toBe(true);
    expect(startInput.element.value).toBe('2024-03-10');
    expect(endInput.element.value).toBe('2024-03-15');
  });

  it('sets the min and max of the start and end date inputs with the time props', () => {
    const startInput = wrapper.find('#datepicker-range-start');
    const endInput = wrapper.find('#datepicker-range-end');
    
    expect(startInput.attributes('max')).toBe(defaultProps.endProp.split('T')[0]);
    expect(endInput.attributes('min')).toBe(defaultProps.startProp.split('T')[0]);    
    expect(endInput.attributes('max')).toBe(defaultProps.currentDate);
  });

  it('emits event when start date changes', async () => {
    const startInput = wrapper.find('#datepicker-range-start');
    await startInput.setValue('2024-03-12');
    
    expect(wrapper.emitted('date-range-selected')).toBeTruthy();
    expect(wrapper.emitted('date-range-selected')?.[0]).toEqual(['2024-03-12', '2024-03-15']);
  });

  it('emits event when end date changes', async () => {
    const endInput = wrapper.find('#datepicker-range-end');
    await endInput.setValue('2024-03-16');
    
    expect(wrapper.emitted('date-range-selected')).toBeTruthy();
    expect(wrapper.emitted('date-range-selected')?.[0]).toEqual(['2024-03-10', '2024-03-16']);
  });

  it('disables inputs when disabled prop is true', async () => {
    await wrapper.setProps({ disabled: true });
    
    expect(wrapper.find('#datepicker-range-start').element.disabled).toBe(true);
    expect(wrapper.find('#datepicker-range-end').element.disabled).toBe(true);
  });
});
