<template>
  <teleport to="#modals">
    <transition name="fade" @afterEnter="shouldShowContent = true">
      <div
        class="base-modal px-sm"
        v-if="shouldShowModal"
        :style="{ height: `${documentHeight()}px` }"
      >
        <transition name="slide-y">
          <div class="base-modal__content" v-show="shouldShowContent">
            <div class="base-modal__head" v-if="isClosable">
              <button @click="closeModal" class="link">
                <font-awesome-icon icon="times"></font-awesome-icon>
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

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";

export default defineComponent({
  setup() {
    const store = useStore();

    const shouldShowModal = computed(() => store.state.modal?.shouldShow);
    const cuurrentModalComponent = computed(() => store.state.modal?.component);
    const shouldShowContent = ref(false);

    function closeModal() {
      shouldShowContent.value = false;
      store.commit(ModalMutationTypes.HIDE_MODAL);
    }

    return {
      closeModal,
      shouldShowModal,
      cuurrentModalComponent,
      shouldShowContent,
      isClosable: computed(() => store.state.modal.isClosable),
      documentHeight: () => document.documentElement.offsetHeight,
    };
  },
});
</script>

<style lang="scss" scoped>
.base-modal {
  $self: &;
  z-index: 4;
  background: rgba($light1, 0.75);
  position: absolute;
  width: 100%;
  display: grid;
  justify-content: center;
  align-items: start;
  &__content {
    $roundness: 0.5rem;
    min-width: 40vw;
    border-radius: $roundness;
    background-color: $light1;
    border: 2px solid $primary;
    margin-top: 2rem;

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