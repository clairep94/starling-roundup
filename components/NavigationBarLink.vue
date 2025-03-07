<template>
  <div
  :data-test="`link-${link.title}`"
  @click="router.push(link.path)"
  class="py-4 px-4 text-white/80 hover:text-white hover:font-medium hover:cursor-pointer flex flex-row items-center gap-x-2 border-l-3"
  :class="{
    'bg-white/30 hover:bg-white/40 text-white font-medium border-l-blue-600': isCurrentLink,
    'bg-white/10 border-l-blue-400 hover:bg-white/30': !isCurrentLink
  }"
>
  <div data-test="user-name-account-type-left" class="w-[45px]">
    <component :is="isCurrentLink ? link.iconFilled : link.icon" />
  </div>
  <div class="hidden md:flex flex-col">
    <p class="font-medium">{{ link.title }}</p>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import "@justeattakeaway/pie-icons-webc/dist/IconHouseLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconHouseFilledLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconCoinsLarge.js";
import "@justeattakeaway/pie-icons-webc/dist/IconCoinsFilledLarge.js";

const props = defineProps<{
  link: {
    path: string;
    icon: string;
    iconFilled: string;
    title: string;
  };
}>();

const router = useRouter();
const route = useRoute();

const isCurrentLink = computed(() => route.path === props.link.path);
</script>

<style scoped></style>
