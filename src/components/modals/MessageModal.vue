<template>
  <div class="msg-modal pt-lg">
    <div v-if="type === 'loading'" class="msg-modal__spinner"></div>
    <div v-else-if="type === 'error'" class="msg-modal__error">
      <base-icon :icon="mdiExclamation" />
    </div>
    <p>
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from "../base/BaseIcon.vue";
import { mdiExclamation } from "@mdi/js";

defineProps<{
  message?: string;
  type: "loading" | "error" | "info";
}>();
</script>

<style lang="scss" scoped>
.msg-modal {
  padding: 1rem 2rem;
  padding-top: 0;
  p {
    color: map-get($gray, 400);
    text-align: center;
  }
  &__error {
    background: $danger;
    color: $danger-light;
    @include sqr(2rem);
    display: grid;
    place-content: center;
    margin: auto;
    border-radius: 50%;
    margin-bottom: 0.5rem;
  }
  &__spinner {
    margin: 1rem auto;
    @include sqr(40px);
    // border: 0.25rem solid $primary;
    // border-bottom-color: transparent;
    border-radius: 50%;
    position: relative;
    animation: outer-spin 1s linear infinite;

    &::before {
      content: "";
      box-sizing: border-box;
      position: absolute;
      inset: 0px;
      border-radius: 50%;
      border: 0.25rem solid $primary;
      animation: inner-spin 2s linear infinite;
    }
  }
}
@keyframes outer-spin {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes inner-spin {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  12.5% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  37.5% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
  62.5% {
    clip-path: polygon(50% 50%, 100% 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
  75% {
    clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 0 100%, 0 0);
  }
  87.5% {
    clip-path: polygon(50% 50%, 0 100%, 0 100%, 0 100%, 0 100%, 0 0);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
}
</style>
