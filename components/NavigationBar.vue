<template>
  <div
    data-test="nav-bar"
    class="bg-dark-purple text-white flex flex-col justify-between"
  >
    <div class="flex flex-col gap-y-3">

      <!-- STARLING LOGO -->
      <div data-test="starling-logo" class="my-6 mx-4 md:w-[200px] xl:w-[240px]">
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

      <!-- USER PROFILE -->
      <NavigationBarProfile />

      <!-- LINKS -->
      <div data-test="navbar-links" class="flex flex-col gap-y-1">
        <NavigationBarLink
          v-for="link in navbarLinks"
          :data-test="`link-${link.title}`"
          :link="link"
        />
      </div>
    </div>

    <!-- LOGOUT BUTTON -->
    <LogoutButton data-test="logout-button" />
  </div>
</template>

<script setup lang="ts">
import "@justeattakeaway/pie-icons-webc/dist/IconUser.js";
import "@justeattakeaway/pie-icons-webc/dist/IconHouseLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconHouseFilledLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconCoinsLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconCoinsFilledLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconGridViewLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconGridViewFilledLarge.js";
import NavigationBarLink from "./NavigationBarLink.vue";
import LogoutButton from "./LogoutButton.vue";
import NavigationBarProfile from "./NavigationBarProfile.vue";

const navbarLinks = [
  {
    title: "Home",
    icon: "icon-house-large",
    iconFilled: "icon-house-filled-large",
    path: "/",
  },
  {
    title: "Spaces",
    icon: "icon-grid-view-large",
    iconFilled: "icon-grid-view-filled-large",
    path: "/spaces",
  },
];

</script>

<style scoped></style>
