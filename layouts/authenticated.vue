<template>
  
  <div class="w-full min-h-screen max-h-screen overflow-clip bg-white flex flex-row">
    <NavigationBar/>
    <main class="flex-grow overflow-scroll">
      <!-- PAGE TITLE SECTION -->
      <div data-test="page-title-section" class="flex flex-col px-6 py-4 pb-0 md:px-8 md:py-6 md:pb-0 border-b border-b-gray-100">

        <!-- USER FULL NAME -->
        <div data-test="user-full-name" class="text-2xl font-bold text-black/80">
          {{ props.pageTitle }}
          <!-- {{ userIdStore.userIdentity.firstName }} {{ userIdStore.userIdentity.lastName }} -->
        </div>

        <!-- TABS -->
        <div data-test="home-page-tabs" class="flex flex-row gap-3">
          <SubPageTab v-for="subPage in props.subPages" :key="subPage.path" :title="subPage.title" :path="subPage.path"/>
        </div>
      </div>

      <slot/>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useUserIdentityStore } from '@/store/userIdentity'
import NavigationBar from '@/components/NavigationBar.vue'
import SubPageTab from '@/components/SubPageTab.vue'

const userIdStore = useUserIdentityStore()

const props = defineProps<{
  pageTitle: string,
  subPages: { title: string, path: string }[]
}>()


</script>

<style lang="scss" scoped>

</style>