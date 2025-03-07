<template>
  <!-- Vertical Navbar -->
  <div
    data-test="nav-bar"
    class="bg-dark-purple text-white flex flex-col justify-between"
  >
    <div class="flex flex-col gap-y-3">
      <!-- Logo -->
      <div class="my-6 mx-4 md:w-[200px] xl:w-[240px]">
        <img
          data-test="logo-mini"
          src="@/public/StarlingLogo.png"
          class="h-10 md:hidden"
        />
        <img
          data-test="logo-full"
          src="@/public/StarlingLogoFullWhite.png"
          class="hidden md:block md:h-12 xl:h-14"
        />
      </div>

      <!-- User Name & Account Type -->
      <div
        data-test="user-name-account-type"
        class="py-4 px-4 bg-white/10 flex flex-row items-center gap-x-2 border-l-teal border-l-3"
      >
        <div data-test="user-name-account-type-left" class="w-[45px]">
          <div
            data-test="user-icon-container"
            class="bg-teal rounded-full h-7 w-7 flex items-center justify-center"
          >
            <icon-user />
          </div>
        </div>
        <div class="hidden md:flex flex-col">
          <p class="font-bold">
            {{ userStore.user?.firstName }} {{ userStore.user?.lastName }}
          </p>
          <p>{{ accountStore.defaultAccount?.name }}</p>
        </div>
      </div>

      <!-- Links -->
      <div data-test="navbar-links" class="flex flex-col gap-y-1">
        <NavigationBarLink
          v-for="link in navbarLinks"
          :data-test="`link-${link.title}`"
          :link="link"
        />
      </div>
    </div>

    <LogoutButton />
  </div>
</template>

<script setup lang="ts">
import "@justeattakeaway/pie-icons-webc/dist/IconUser.js";
import "@justeattakeaway/pie-icons-webc/dist/IconHouseLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconHouseFilledLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconCoinsLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconCoinsFilledLarge.js";
import { useUserStore } from "~/store/user";
import { useAccountStore } from "~/store/account";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const accountStore = useAccountStore();

const router = useRouter();

const navbarLinks = [
  {
    title: "Home",
    icon: "icon-house-large",
    iconFilled: "icon-house-filled-large",
    path: "/account",
  },
  {
    title: "Savings Space",
    icon: "icon-coins-large",
    iconFilled: "icon-coins-filled-large",
    path: "/account/savings-space",
  },
];

function handleLogout() {
  userStore.logout();
  router.push("/");
}
</script>

<style scoped></style>
