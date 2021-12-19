<template>
  <div class="confirm-modal px-xl py-lg d-grid">
    <p>{{ message }}</p>
    <button class="primary mt-lg" @click="handleConfirm">Confirm</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";

export default defineComponent({
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  emits: ["closed"],
  setup(_, { emit }) {
    const store = useStore();

    function handleConfirm() {
      emit("closed");
      const { onSuccess } = store.state.modal;
      store.commit(ModalMutationTypes.HIDE_MODAL);

      if (onSuccess) onSuccess();
    }

    return { handleConfirm };
  },
});
</script>