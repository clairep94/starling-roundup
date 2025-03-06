<template>
  <div class="h-full w-full flex flex-col bg-purple-950">
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
    {{ data }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const data = ref(null)
onMounted(() => {
  addTodo()
})
async function addTodo() {
  const todo = await $fetch('https://dummyjson.com/products', {
    method: 'GET',
  })
  data.value = todo
}
</script>