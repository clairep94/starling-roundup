import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import DateRangePicker from './DateRangePicker.vue';
import { setActivePinia, createPinia } from 'pinia';
import { useDateRangeStore } from '../store/dateRange';

const defaultStoreValues = {
  selectedStart: '2024-03-10T12:34:56Z',
  selectedEnd: '2024-03-15T07:08:09Z'
};

const currentDate = '2024-03-18T07:08:09Z';

describe('DateRangePicker', () => {
  let wrapper: VueWrapper<any>;
  let dateRangeStore: ReturnType<typeof useDateRangeStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    dateRangeStore = useDateRangeStore();
    dateRangeStore.selectedStart = defaultStoreValues.selectedStart;
    dateRangeStore.selectedEnd = defaultStoreValues.selectedEnd;

    wrapper = mount(DateRangePicker, {
      props: {
        currentDate,
        disabled: false
      }
    });
  });

  it('renders with the initial start and end values normalized with the time removed', () => {
    const startInput = wrapper.find('#datepicker-range-start');
    const endInput = wrapper.find('#datepicker-range-end');

    expect(startInput.exists()).toBe(true);
    expect(endInput.exists()).toBe(true);
    expect(startInput.element.value).toBe('2024-03-10');
    expect(endInput.element.value).toBe('2024-03-15');
  });

  it('sets the min and max of the start and end date inputs correctly', () => {
    const startInput = wrapper.find('#datepicker-range-start');
    const endInput = wrapper.find('#datepicker-range-end');

    expect(startInput.attributes('max')).toBe(dateRangeStore.selectedEnd.split('T')[0]);
    expect(endInput.attributes('min')).toBe(dateRangeStore.selectedStart.split('T')[0]);
    expect(endInput.attributes('max')).toBe(currentDate.split('T')[0]);
  });

  it('updates the store when start date changes', async () => {
    const startInput = wrapper.find('#datepicker-range-start');
    await startInput.setValue('2024-03-12');

    expect(dateRangeStore.selectedStart).toBe('2024-03-12T00:00:00.000Z');
  });

  it('updates the store when end date changes', async () => {
    const endInput = wrapper.find('#datepicker-range-end');
    await endInput.setValue('2024-03-16');

    expect(dateRangeStore.selectedEnd).toBe("2024-03-16T23:59:59.999Z");
  });

  it('disables inputs when disabled prop is true', async () => {
    await wrapper.setProps({ disabled: true });

    expect(wrapper.find('#datepicker-range-start').element.disabled).toBe(true);
    expect(wrapper.find('#datepicker-range-end').element.disabled).toBe(true);
  });
});
