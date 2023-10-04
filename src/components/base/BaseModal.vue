<template>
  <teleport to="#modals">
    <transition name="fade" @afterEnter="shouldShowContent = true">
      <div class="base-modal" v-if="shouldShowModal">
        <div class="base-modal__backdrop"></div>
        <transition name="slide-y">
          <div class="base-modal__content" v-show="shouldShowContent">
            <div class="base-modal__head" v-if="isClosable">
              <button @click="closeModal">
                <base-icon :icon="mdiClose" size="md" />
              </button>
            </div>
            <div class="base-modal__body">
              <component
                @closed="shouldShowContent = false"
                :is="cuurrentModalComponent"
              />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";
import { mdiClose } from "@mdi/js";
import BaseIcon from "./BaseIcon.vue";

const store = useStore();

const isClosable = computed(() => store.state.modal.isClosable);
const shouldShowModal = computed(() => store.state.modal?.shouldShow);
const cuurrentModalComponent = computed(() => store.state.modal?.component);

const shouldShowContent = ref(false);

function closeModal() {
  shouldShowContent.value = false;
  store.commit(ModalMutationTypes.HIDE_MODAL);
}
</script>

<style lang="scss">
.base-modal {
  width: 100%;
  position: fixed;
  min-height: 100vh;

  @include overlap-children;
  &__backdrop {
    height: 100%;
    background: rgba(map-get($gray, 800), 0.25);
  }
  &__content {
    height: max-content;
    margin: 2rem auto;
    width: max-content;
    border-radius: 0.25rem;
    background-color: map-get($gray, 100);
    box-shadow: 0 4px 16px rgba(map-get($gray, 800), 0.1);
  }
  &__head {
    display: flex;
    justify-content: flex-end;
    button {
      padding: 1rem;
      font-size: 1.5rem;
      color: map-get($gray, 400);
    }
  }
}
</style>
