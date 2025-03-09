<template>
  <div data-test="login-form" class="flex flex-col gap-y-6 md:p-12">
    <div data-test="login-form-title" class="flex flex-col gap-y-2">
      <h2 class="text-lg md:text-2xl font-light text-text-default/70">Log in to</h2>
      <h1 class="text-4xl tracking-[1px] font-medium text-black/80 md:text-5xl">
        Online Banking
        <span class="font-light text-text-default/70">Roundup</span>
      </h1>
    </div>

    <form data-test="login-form"
      @submit.prevent="handleSubmit" 
      class="flex flex-col gap-y-10">
      <div data-test="session-token-form-field"
        class="flex flex-col gap-y-2">
        <label
          data-test="session-token-form-field-label"
          for="session-token" 
          class="text-text-default/80 text-sm font-semibold md:text-lg">
          Session Token
        </label>
        <input
          id="session-token"
          v-model="sessionToken"
          type="password"
          placeholder="Enter your Session Token"
          class="p-3 border rounded-md border-input-border"
          required
        />
        <label 
          data-test="error-message" v-if="showErrorMessage"
          class="text-red-700 font-medium"
        >
          Invalid session token. Please get a valid token from 
          <a class="underline hover:cursor-pointer"
            href="https://developer.starlingbank.com/"
            target="_blank"
          >
            Starling Developers Portal.
          </a>
        </label>
      </div>

      <!-- Submit Button -->
      <div>
        <button
          data-test="show-login-form-button"
          type="submit"
          class="rounded-full text-text-default py-2 px-6 text-lg transition-all"
          :class="{
            'bg-button-teal hover:bg-button-teal-hover hover:cursor-pointer': !userIdStore.isLoadingLogin,
            'bg-gray-400 cursor-not-allowed': userIdStore.isLoadingLogin
          }"
          :disabled="userIdStore.isLoadingLogin"
        >
          {{ userIdStore.isLoadingLogin ? 'Logging in...' : 'Log in with sandbox user' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserIdentityStore } from '../store/userIdentity'
import { useRouter } from 'vue-router'

const userIdStore = useUserIdentityStore()
const sessionToken = ref('')
const router = useRouter()
const showErrorMessage = ref(false)

const handleSubmit = async () => {
  showErrorMessage.value = false
  if (!sessionToken.value) return
  const successfulLogin = await userIdStore.login(sessionToken.value)
  if (successfulLogin) {
    navigateTo('/')
  } else {
    showErrorMessage.value = true
  }
}
</script>