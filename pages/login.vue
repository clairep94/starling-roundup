<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 h-screen">

    <!-- LEFT GRAPHIC -->
    <div data-test="left-side"
      class="bg-dark-purple hidden lg:flex items-center justify-center">

      <div data-test="phone-image-container" v-if="!showLoginForm"  
        class="w-2/3 h-1/3 flex items-center justify-center">
        <img src='@/public/Laptop.png' alt="laptop"/>
      </div>

      <div data-test="laptop-image-container" v-else
        class="w-1/4 flex items-center justify-center"> 
        <img  src='@/public/Phone.png' alt="phone"/>
      </div>
    </div>

    <!-- RIGHT FORM -->
    <div data-test="right-side"
      class="w-full h-full bg-white min-h-screen flex
      flex-col p-6 justify-between
      "
      >
      <div data-test="logo-header" class="w-full flex md:p-12">
        <img @click="showLoginForm = false"
          src="@/public/StarlingLogoFullDark.png"
          class="h-14 md:h-18 hover:cursor-pointer"
        />
      </div>

      <div data-test="welcome-text" v-if="!showLoginForm"
        class="flex flex-col gap-y-6 md:p-12">
        <h1 class="text-4xl tracking-[1px] font-medium text-black/80
          md:text-5xl
        ">
          Welcome to <br>Online Banking
          <span class="font-light text-text-default/70">
            Roundup
          </span>
        </h1>
        <h2 class="text-lg text-black/70 font-light tracking-[0.5px]
          md:text-2xl
        ">
          To get started, please login.
        </h2>
        <div>
          <button data-test="show-login-form-button"
            class="rounded-full bg-button-teal hover:bg-button-teal-hover text-text-default py-2 px-6 text-lg hover:cursor-pointer"
            @click="handleShowLoginForm"
          >
            Log In
          </button>
        </div>
      </div>

      <login-form data-test="login-form" v-else/>

      <div data-test="credits" 
        class="w-full bg-extra-light-grey p-8 text-black/80 text-lg flex flex-col gap-3">
        <p>
          This is the Frontend Tech Test of <span class="font-bold">Claire Peng.</span>
        </p>
        <a class="text-blue font-medium" 
        href="https://www.linkedin.com/in/pengclaire/?originalSubdomain=uk"
        target="_blank" rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue'
import {ref} from 'vue'
useHead({
  title: 'Login'
})

const showLoginForm = ref<boolean>(false)

function handleShowLoginForm() {
  showLoginForm.value = true
}

</script>

<style scoped>

</style>