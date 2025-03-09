<template>
  <div v-if="!userIdStore.token">
    Not logged in...
  </div>
  <NuxtLayout v-else name="authenticated">
    <div>
      Savings Spaces
    </div>
    show savings spaces here
    create new savings space
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: 'Savings Spaces'
})

</script>

<style scoped>

</style>