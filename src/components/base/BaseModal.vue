<template>
  <teleport to="#modals">
    <transition name="fade" @afterEnter="shouldShowContent = true">
      <div class="base-modal" v-if="shouldShowModal">
        <transition name="slide-y">
          <div class="base-modal__content" v-show="shouldShowContent">
            <div class="base-modal__head">
              <button @click="closeModal" class="link">
                <font-awesome-icon icon="times"></font-awesome-icon>
              </button>
            </div>
            <div class="base-modal__body">
              <component :is="cuurrentModalComponent" />
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