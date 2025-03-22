<template>
  <div class="relative items-center justify-center flex">
    <div class="absolute mix-blend-multiply bg-gray-100 rounded-full h-40 w-40 flex flex-col items-center justify-center translate-y-4">
      <slot></slot>
    </div>
    <Doughnut
      v-if="loaded"
      id="my-chart-id"
      :data="chartData"
      class="opacity-90"
      :options="{ maintainAspectRatio: false, cutout: '70%', radius: '90%' }"
    />
  </div>
</template>

<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ref } from "vue";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

const loaded = ref(true);

const chartData = {
  "labels": ["Income", "Payments"],
  "datasets": [
    {
      "label": "Net amount",
      "data": [50, 100],
      "backgroundColor": [
        "rgba(3,199,194,255)",
        "rgba(196,39,80,255)",
        "rgba(52,149,173,255)",
        "rgba(201,62,133,255)",
        "rgba(242,133,100,255)",
        "rgba(0,95,130,255)",
        "rgba(123,137,64,255)",
        "rgba(175,175,175,255)"
      ],
      "hoverOffset": 4
    },
    {
      "label": "Transactions",
      "data": [5,2],
      "backgroundColor": [
        "rgba(3,199,194,255)",
        "rgba(196,39,80,255)",
        "rgba(52,149,173,255)",
        "rgba(201,62,133,255)",
        "rgba(242,133,100,255)",
        "rgba(0,95,130,255)",
        "rgba(123,137,64,255)",
        "rgba(175,175,175,255)"
      ],
      "hoverOffset": 4
    }
  ]
}
</script>

<style scoped>

</style>