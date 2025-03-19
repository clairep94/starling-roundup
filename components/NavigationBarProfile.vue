<template>
  <div
    data-test="user-navbar-profile"
    class="py-4 px-4 bg-white/10 flex flex-row items-center gap-x-2 border-l-teal border-l-3"
  >
    <!-- ICON -->
    <div data-test="user-navbar-profile-left" class="w-[45px]">
      <div
        data-test="user-icon-container"
        class="bg-teal rounded-full h-7 w-7 flex items-center justify-center"
      >
        <icon-user data-test="user-icon" />
      </div>
    </div>

    <!-- PROFILE -->
    <div data-test="user-navbar-profile-right" class="hidden md:flex">
      <!-- LOADING -->
      <div data-test="user-and-account-loading" 
        v-if="userIdStore.isLoadingLogin || accountsStore.isLoadingAccounts">
        Loading...
      </div>

      <!-- NO DATA -->
      <div data-test="user-and-account-no-data-found" 
        v-else-if="!(userIdStore.userIdentity.firstName && accountsStore.selectedAccount)">
        No user found
      </div>

      <!-- VALID DATA -->
      <div data-test="user-name-and-account-type" class="flex-col"
        v-else >
        <p data-test="user-full-name" class="font-bold">
          {{userIdStore.userIdentity.firstName}} {{userIdStore.userIdentity.lastName}}
        </p>
        <p data-test="user-account-type">
          {{ accountsStore.selectedAccount.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserIdentityStore } from '@/store/userIdentity'
import { useAccountsStore } from '@/store/accounts'

const userIdStore = useUserIdentityStore()
const accountsStore = useAccountsStore()
</script>

<style scoped></style>
