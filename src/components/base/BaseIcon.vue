<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="mdi-arrow-right"
    :width="sizePx"
    :height="sizePx"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path :d="icon" />
  </svg>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },

  size: {
    type: String as PropType<"xs" | "sm" | "md" | "lg">,
    default: "sm",
  },
});

const sizePx = computed(() => {
  switch (props.size) {
    case "xs":
      return 16;
    case "sm":
      return 24;
    case "md":
      return 32;
    case "lg":
      return 48;
    default:
      return 24;
  }
});
</script>
