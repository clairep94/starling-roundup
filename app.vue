<template>
  <div class="h-full w-full flex flex-col bg-home-peach max-w-5xl">
    <div class="w-full text-home-white bg-home-darkblue p-2">
      Starling Bank
    </div>
    <h1 class="text-3xl font-bold underline text-home-darkblue">
      Hello world!
    </h1>
    <div class="flex p-2 rounded-sm border-input-border border">
      <icon-heart/>
    </div> 
    <pre class="text-text-secondary">
      {{ data }}
    </pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import '@justeattakeaway/pie-icons-webc/dist/IconHeart.js';

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