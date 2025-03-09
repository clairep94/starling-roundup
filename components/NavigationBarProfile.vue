<template>
  <div
    data-test="user-navbar-profile"
    class="py-4 px-4 bg-white/10 flex flex-row items-center gap-x-2 border-l-teal border-l-3"
  >
    <div data-test="user-navbar-profile-left" class="w-[45px]">
      <div
        data-test="user-icon-container"
        class="bg-teal rounded-full h-7 w-7 flex items-center justify-center"
      >
        <icon-user data-test="user-icon" />
      </div>
    </div>
    <div data-test="user-navbar-profile-right" class="hidden md:flex">
      <!-- LOADING -->
      <div v-if="userIdentityStore.isLoginLoading || accountsStore.isAccountsLoading">
        Loading user details...
      </div>

      <!-- DATA -->
      <div v-if="userIdentityStore.userIdentity && accountsStore.accounts"
        data-test="user-name-and-account-type" class="flex-col">
        <p data-test="user-full-name" class="font-bold">
          {{ userIdentityStore.userIdentity.firstName }} {{ userIdentityStore.userIdentity.lastName }}
        </p>
        <p data-test="user-account-type">
          {{ accountStore.defaultAccount?.name }}
        </p>
      </div>

      <!-- ERROR -->
      <div v-else>
        Error loading user
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserIdentityStore } from "~/store/userIdentity";
import { useAccountsStore } from "~/store/accounts";

const userIdentityStore = useUserIdentityStore();
const accountsStore = useAccountsStore();
</script>

<style scoped></style>
