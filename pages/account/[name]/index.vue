<template>
  <div>
    Account Name: {{ route.params.name }}
  </div>
  show transactions here and option to add to savings spaces
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()

useHead({
  title: 'Account Overview'
})

</script>

<style scoped>

</style>