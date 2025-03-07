<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 h-screen">
    <div data-test="left-side"
      class="bg-dark-purple hidden lg:flex items-center justify-center"
    >
      <div data-test="image-container"
        class="w-1/2"
      >
        <img src="@/public/Laptop.png"
        />
      </div>
    </div>
    <div data-test="right-side"
      class="w-full h-full bg-white min-h-screen flex
      flex-col p-10 justify-between
      "
      >
      <div data-test="logo-header" class="w-full flex md:p-12">
        <img src="@/public/StarlingLogoFullDark.png"
          class="h-18 md:h-24"
        />
      </div>

      <div data-test="welcome-text" class="flex flex-col gap-y-8 md:p-12">
        <h1 class="text-5xl tracking-[1px] font-medium text-black/80
          md:text-6xl
        ">
          Welcome to <br>Online Banking - Roundup
        </h1>
        <h2 class="text-2xl text-black/70 font-light tracking-[0.5px]
          md:text-3xl
        ">
          To get started, please login.
        </h2>
        <div>
          <button data-test="show-login-form-button"
            class="rounded-full bg-button-teal hover:bg-button-teal-hover text-text-default py-3 px-8 text-2xl hover:cursor-pointer"
            @click="showLoginForm"
          >
            Log In
          </button>
        </div>
      </div>

      <div data-test="credits" 
        class="w-full bg-extra-light-grey p-10 text-black/80 text-2xl flex flex-col gap-6"
      >
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
useHead({
  title: 'Login'
})

function showLoginForm() {
  console.log('showLoginForm')
}
</script>

<style scoped>

</style>