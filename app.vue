<template>
  <div class="h-full w-full flex flex-col bg-white max-w-5xl">
    <h1 class="text-3xl font-bold underline text-text-default">
      Hello world!
    </h1>
   
    <pre class="text-text-secondary">
    {{ data }}
    </pre>
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