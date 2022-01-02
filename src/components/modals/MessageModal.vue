<template>
  <div class="msg-modal pt-lg">
    <div v-if="type === 'loading'" class="msg-modal__spinner"></div>
    <div v-else-if="type === 'error'" class="msg-modal__error">
      <font-awesome-icon icon="times"></font-awesome-icon>
    </div>
    <p class="text-center mt-lg text-medium px-xl py-sm">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    message: {
      type: String,
      default: null,
    },
    type: {
      type: String as PropType<"loading" | "error" | "info">,
      required: true,
    },
  },
});
</script>

<style  lang="scss" scoped>
.msg-modal {
  background: $dark2;
  p {
    color: $light3;
    background-color: $dark1;
  }
  &__spinner {
    margin: auto;
    @include sqr(100px);
    border: 0.25rem solid $primary;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: spin 0.5s linear infinite;
  }
  &__error {
    // background: $error;
    // box-sizing: content-box;
    // color: $light1;
    // width: max-content;
    // margin: auto;
    // border-radius: 4rem;
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