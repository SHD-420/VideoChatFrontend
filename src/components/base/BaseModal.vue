<template>
  <teleport to="#modals">
    <transition name="fade" @afterEnter="shouldShowContent = true">
      <div class="base-modal" v-if="modelValue">
        <transition name="slide-y">
          <div class="base-modal__content" v-show="shouldShowContent">
            <div class="base-modal__head">
              <button @click="closeModal" class="link">
                <font-awesome-icon icon="times"></font-awesome-icon>
              </button>
            </div>
            <div class="base-modal__body">
              <slot></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { emit }) {
    const shouldShowContent = ref(false);
    function closeModal() {
      shouldShowContent.value = false;
      emit("update:modelValue", false);
    }
    return {
      closeModal,
      shouldShowContent,
    };
  },
});
</script>

<style lang="scss" scoped>
.base-modal {
  $self: &;
  z-index: 1;
  background: rgba($light1, 0.75);
  position: fixed;
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-content: center;
  &__content {
    $roundness: 0.5rem;
    min-width: 40vw;
    border-radius: $roundness;
    background-color: $light1;
    border: 2px solid $primary;

    #{$self}__head {
      display: flex;
      justify-content: flex-end;
      border-bottom: 1px solid $light3;
      button {
        font-size: 1.5rem;
        color: rgba($primary, 0.5);
      }
    }
  }
}
</style>