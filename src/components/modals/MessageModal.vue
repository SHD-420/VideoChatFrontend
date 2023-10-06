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
  &__spinner {
    margin: auto;
    margin-bottom: 1rem;
    @include sqr(40px);
    border: 0.25rem solid $primary;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: spin 0.5s linear infinite;
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
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>