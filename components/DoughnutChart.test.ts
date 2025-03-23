import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import DoughnutChart from './DoughnutChart.vue'

function factory(
  data?: {
    labels: string[],
    datasets: {
      label: string,
      data: number[]
      }[]
    }, 
  optionsOverrides?: any): VueWrapper<any> {
  return shallowMount(DoughnutChart, {
    global: {
    },
    props: {
      data,
      optionsOverrides
    }, 
    slots: {
      default: ['abc']
    }
  })
}

const noDataChartData = {
  "labels": ["No transaction data available"],
  "datasets": [
    {
      "label": "No data available",
      "data": [1],
      "backgroundColor": ["rgba(175,175,175,255)"],
      "hoverOffset": 4
    }
  ]
}
const segmentColours = [
  "rgba(3,199,194,255)",
  "rgba(196,39,80,255)",
  "rgba(52,149,173,255)",
  "rgba(201,62,133,255)",
  "rgba(242,133,100,255)",
  "rgba(0,95,130,255)",
  "rgba(123,137,64,255)",
  "rgba(175,175,175,255)"
]

const defaultOptions = {
  maintainAspectRatio: false,
  cutout: '70%',
  radius: '90%',
}

describe('Doughnut component', ()=> {
  let wrapper: VueWrapper<any>
  let doughnutChart: any

  describe('slots', () => {
    it('should mount with slot content', () => {
      wrapper = factory()
      expect(wrapper.text()).toContain('abc')
    })
  })

  describe('data', () => {
    describe('when there is no data', () =>{
      it('should mount the doughnut chart with the no-data chart data', () => {
        wrapper = factory()
        doughnutChart = wrapper.findComponent('[data-test="doughnut-chart"]')
        expect(doughnutChart.props('data')).toEqual(noDataChartData)
      })
    })
    describe('when there is data', () =>{
      it('should mount the doughnut chart with chart data', () => {
        wrapper = factory({
          labels: ['item 1', 'item 2', 'item 3'],
          datasets: [
            { label: 'Total GBP', data: [123.45, -12.34, 567.45] },
            { label: 'Number of Transactions', data: [5, 10, 3] }
          ]
        })
        doughnutChart = wrapper.findComponent('[data-test="doughnut-chart"]')
        expect(doughnutChart.props('data')).toEqual({
          labels: ['item 1', 'item 2', 'item 3'],
          datasets: [
            { label: 'Total GBP', data: [123.45, -12.34, 567.45], backgroundColor: segmentColours, hoverOffset: 4 },
            { label: 'Number of Transactions', data: [5, 10, 3], backgroundColor: segmentColours, hoverOffset: 4 }
          ]
        })
      })
    })
    
  })
  describe('options', () => {
    describe('when there are no options overrides', () => {
      it('should mount the doughnut chart with the default options', () => {
        wrapper = factory()
        doughnutChart = wrapper.findComponent('[data-test="doughnut-chart"]')
        expect(doughnutChart.props('options')).toEqual(defaultOptions)
      })
    })
    describe('when there are option overrides', () => {
      it('should mount with the option overrides', () => {
        wrapper = factory({
          labels: ['item 1', 'item 2', 'item 3'],
          datasets: [
            { label: 'Total GBP', data: [123.45, -12.34, 567.45] },
            { label: 'Number of Transactions', data: [5, 10, 3] }
          ]
        },
        { test: 'test_option', cutout: '50%' })

        doughnutChart = wrapper.findComponent('[data-test="doughnut-chart"]')
        expect(doughnutChart.props('options')).toEqual({
          test: 'test_option',
          cutout: '50%',
          maintainAspectRatio: false,
          radius: '90%'
        })

      })
    })
  })
})