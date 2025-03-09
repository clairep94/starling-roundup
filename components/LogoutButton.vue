<template>
  <button data-test="logout-button"
    class="py-4 px-4 hover:cursor-pointer hover:bg-white/10 flex flex-row items-center gap-x-2 text-white/80 hover:text-white"
    @click="handleLogout">
    <div data-test="user-name-account-type-left" class="w-[45px]">        
      <icon-arrow-in-circle-large/>
    </div>
    <div class="hidden md:flex flex-col"
    >
    <p>Log out</p>
    </div>
  </button>
</template>

<script setup lang="ts">
import '@justeattakeaway/pie-icons-webc/dist/IconArrowInCircleLarge.js'
import { useUserIdentityStore } from '~/store/userIdentity'

const userIdentityStore = useUserIdentityStore()

function handleLogout(){
  userIdentityStore.logout()
}
</script>

<style scoped>

</style>