<template>
  <!-- vertical navbar -->
  <div data-test="nav-bar"
    class="bg-dark-purple text-white flex flex-col justify-between"
  >
    <div class="flex flex-col gap-y-3">
    <!-- Logo -->
    <div class="my-6 mx-4 md:w-[200px] xl:w-[240px]">
      <img data-test="logo-mini"
        src="@/public/StarlingLogo.png"
        class="h-10 md:hidden"
      />
      <img data-test="logo-full"
        src="@/public/StarlingLogoFullWhite.png"
        class="hidden md:block md:h-12 xl:h-14"
      />
    </div>

    <!-- User Name & Account Type -->
    <div data-test="user-name-account-type"
      class="py-4 px-4 bg-white/10 flex flex-row items-center gap-x-2 border-l-teal border-l-3"
      >
      <div data-test="user-name-account-type-left" class="w-[45px]">
        <div data-test="user-icon-container"
          class="bg-teal rounded-full h-7 w-7 flex items-center justify-center">
          <icon-user/>
        </div>
      </div>
      <div class="hidden md:flex flex-col">
        <p class="font-bold">{{userFullName}}</p>
        <p>{{userAccountType}}</p>
      </div>
    </div>

    <!-- Links -->
    <div data-test="navbar-links" class="flex flex-col gap-y-1">
      <div v-for="link in navbarLinks"
        :data-test="`link-${link}`"
        @click="console.log(link)"
        class="py-4 px-4 text-white/80 hover:text-white hover:font-medium bg-white/10 hover:bg-white/30 hover:cursor-pointer flex flex-row items-center gap-x-2 border-l-blue-400 border-l-3"
        >
        <div data-test="user-name-account-type-left" class="w-[45px]">        
          <icon-house-large/>
        </div>
        <div class="hidden md:flex flex-col">
          <p>{{link}}</p>
        </div>
      </div>
    </div>

    
    </div>

    <div class="py-4 px-4 hover:bg-white/10 flex flex-row items-center gap-x-2 text-white/80 hover:text-white">
      <div data-test="user-name-account-type-left" class="w-[45px]">        
        <icon-arrow-in-circle-large/>
      </div>
      <div class="hidden md:flex flex-col">
        <p>Log out</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@justeattakeaway/pie-icons-webc/dist/IconUser.js';
import '@justeattakeaway/pie-icons-webc/dist/IconHouseLarge.js'
import '@justeattakeaway/pie-icons-webc/dist/IconHouseFilledLarge.js'
import '@justeattakeaway/pie-icons-webc/dist/IconArrowInCircleLarge.js'

const userFullName = "Claire Peng" //TODO: change this later
const userAccountType = "Personal"

const navbarLinks = [
  "Home",
  "Savings Spaces"
]

</script>

<style scoped>

</style>