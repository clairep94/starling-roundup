<template>
  <div v-if="!userIdStore.token" data-test="redirecting-to-login" class="flex flex-col items-center justify-center h-screen">
    Redirecting to login page...
  </div>
  <NuxtLayout v-else name="authenticated"
    pageTitle="Spaces"
    :subPages="[
      { title: 'Spaces', path: '/spaces' },
      { title: 'Create a new space', path: '/spaces/create' }
    ]">

    <!-- CREATE A SAVINGS SPACE MAIN -->
    <div data-test="create-space-main" class="flex flex-col flex-grow px-6 py-4 md:px-8 md:py-6 overflow-scroll bg-gray-50 min-h-full gap-3">
  
      <!-- CREATE A SAVINGS SPACE FORM -->
      <div class="bg-white rounded-lg border border-input-border/70 p-6 flex flex-col gap-5">
        <h3 class="text-2xl text-black/80 font-extrabold">
          Create a new Space
        </h3>

        <form data-test="create-space-form"
          @submit.prevent="handleSubmit" 
          class="flex flex-col gap-y-6">

          <div data-test="space-name-form-field"
          class="flex flex-col gap-y-2">
            <label
              data-test="space-name-form-field-label"
              for="space-name" 
              class="text-black/80 text-md font-semibold">
              Name:
            </label>
            <input
              id="space-name"
              v-model="spaceName"
              type="text"
              placeholder="Eg. Trip to Paris"
              class="p-3 border rounded-md border-input-border"
              required
            />
          </div>

          <div data-test="space-target-field"
            class="flex flex-col gap-y-2">
            <label
              data-test="space-target-form-field-label"
              for="space-target" 
              class="text-black/80 text-md font-semibold">
              Target Amount:
            </label>

            <!-- Below assumes that minor units are always /100 of friendly units -->
            <input
              id="space-target"
              v-model="spaceTarget"
              type="number"
              step="0.01"
              placeholder="Eg. 123.45"
              class="p-3 border rounded-md border-input-border"
              required
            />
          </div>

          <!-- Submit button -->
          <div class="w-full flex items-center">
            <button
              data-test="submit-create-space-form"
              type="submit"
              class="rounded-full text-text-default py-2 px-6 text-md transition-all bg-button-teal hover:bg-button-teal-hover hover:cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAccountsStore } from '../../store/accounts'
import { useUserIdentityStore } from '../../store/userIdentity'
import { useSavingsGoalsStore } from '../../store/savingsGoals'
import { useNotificationsStore } from '../../store/notifications'

const userIdStore = useUserIdentityStore()
const accountsStore = useAccountsStore()
const savingsGoalsStore = useSavingsGoalsStore()
const notificationsStore = useNotificationsStore()

useHead({
  title: 'Create Savings Space'
})

const spaceName = ref<string>('')
const spaceTarget = ref<number>(undefined)

const formData = computed(() => {
  return {
    name: spaceName.value,
    currency: accountsStore.selectedAccount?.currency ?? "GBP", 
    target: {
      currency: accountsStore.selectedAccount?.currency ?? "GBP", 
      minorUnits: (spaceTarget.value*100)
    },
    base64EncodedPhoto: "string"
  }
})

async function handleSubmit (){
  console.log('submitting form:', formData.value)
  const result = await savingsGoalsStore.createSavingsGoal(formData.value)
  if (result === true) {
    console.log('success!')
    notificationsStore.addNotification({
      variant: 'success',
      message: 'Successfully created new savings space.'
    })
    navigateTo('/spaces')
  }
}
</script>

<style scoped>

</style>