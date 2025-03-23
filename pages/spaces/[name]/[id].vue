<template>
  <div v-if="!userIdStore.token" data-test="redirecting-to-login" class="flex flex-col items-center justify-center h-screen">
    Redirecting to login page...
  </div>
  <NuxtLayout v-else name="authenticated"
    pageTitle="Spaces"
    :subPages="[
      { title: decodeURI(name), path: `/spaces/${name}/${id}` },
      { title: 'Back to All Spaces', path: '/spaces' },
    ]">

    <!-- SAVINGS SPACE :ID MAIN -->
    <div data-test="savings-space-individual-main" class="flex flex-col flex-grow px-6 py-4 md:px-8 md:py-6 overflow-scroll bg-gray-50 min-h-full gap-3">
      <h4>{{decodeURI(name)}}</h4>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useUserIdentityStore } from '../../../store/userIdentity'
import { useRoute } from 'vue-router'

const userIdStore = useUserIdentityStore()
const route = useRoute()
const {name, id} = route.params

useHead({
  title: decodeURI(name)
})

const isSpaceLoading = ref(false)
const spaceData = ref()


</script>

<style scoped>

</style>