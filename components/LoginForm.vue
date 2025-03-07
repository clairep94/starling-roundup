<template>
  <div data-test="login-form" class="flex flex-col gap-y-6 md:p-12">
    <div class="flex flex-col gap-y-2">
      <h2 class="text-lg md:text-2xl font-light text-text-default/70">Log in to</h2>
      <h1 class="text-4xl tracking-[1px] font-medium text-black/80 md:text-5xl">
        Online Banking
        <span class="font-light text-text-default/70">Roundup</span>
      </h1>
    </div>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-10">
      <!-- Session Token -->
      <div class="flex flex-col gap-y-2">
        <label for="session-token" class="text-text-default/80 text-sm font-semibold md:text-lg">
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
      </div>

      <!-- Submit Button -->
      <div>
        <button
          data-test="show-login-form-button"
          type="submit"
          class="rounded-full bg-button-teal hover:bg-button-teal-hover text-text-default py-2 px-6 text-lg hover:cursor-pointer"
          :disabled="userStore.isLoggingIn"
        >
          {{ userStore.isLoggingIn ? 'Logging in...' : 'Log in with sandbox user' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const sessionToken = ref('')

const handleSubmit = async () => {
  if (!sessionToken.value) return
  await userStore.login(sessionToken.value)
}
</script>