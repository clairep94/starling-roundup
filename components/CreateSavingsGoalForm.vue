<template>
  <div class="bg-white rounded-lg border border-input-border/70 p-6 flex flex-col gap-5">

    <!-- TITLE -->
    <h3 data-test="create-savings-space-form-title"
    class="text-2xl text-black/80 font-extrabold">
      Create a new Space
    </h3>

    <!-- FORM -->
    <form data-test="create-space-form"
      @submit.prevent="handleSubmit" 
      class="flex flex-col gap-y-6">

      <!-- SPACE NAME -->
      <div data-test="space-name-form-field"
        class="flex flex-col gap-y-2">
        <label
          data-test="space-name-form-field-label"
          for="space-name" 
          class="text-black/80 text-md font-semibold">
          Name
          <span class="text-sm font-medium text-black/60">
            Required
          </span>
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

      <!-- SPACE TARGET AMOUNT -->
      <div data-test="space-target-field"
        class="flex flex-col gap-y-2">
        <label
          data-test="space-target-form-field-label"
          for="space-target" 
          class="text-black/80 text-md font-semibold">
          Target Amount
        </label>

        <!-- Below assumes that minor units are always /100 of friendly units -->
        <input
          id="space-target"
          v-model="spaceTarget"
          type="number"
          step="0.01"
          placeholder="Eg. 123.45"
          class="p-3 border rounded-md border-input-border"
        />
      </div>

      <!-- Submit button -->
      <div class="w-full flex items-center">
        <button
          data-test="submit-create-space-form"
          type="submit"
          class="rounded-full text-text-default py-2 px-6 text-lg transition-all"
          :class="{
            'bg-button-teal hover:bg-button-teal-hover hover:cursor-pointer': !savingsGoalsStore.isLoadingCreateSavingsGoal,
            'bg-gray-400 cursor-not-allowed': savingsGoalsStore.isLoadingCreateSavingsGoal
          }"
          :disabled="savingsGoalsStore.isLoadingCreateSavingsGoal"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAccountsStore } from '../store/accounts'
import { useSavingsGoalsStore } from '../store/savingsGoals'
import { useNotificationsStore } from '../store/notifications'
import { navigateTo } from 'nuxt/app'

const accountsStore = useAccountsStore()
const savingsGoalsStore = useSavingsGoalsStore()
const notificationsStore = useNotificationsStore()

const spaceName = ref<string>('')
const spaceTarget = ref<number | undefined>(undefined)

const formData = computed(() => {
  return {
    name: spaceName.value,
    currency: accountsStore.selectedAccount?.currency ?? "GBP", 
    target: {
      currency: accountsStore.selectedAccount?.currency ?? "GBP", 
      minorUnits: (spaceTarget.value? spaceTarget.value*100 : 0)
    },
  }
})

async function handleSubmit (){
  const result = await savingsGoalsStore.createSavingsGoal(formData.value)
  if (result === true) {
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