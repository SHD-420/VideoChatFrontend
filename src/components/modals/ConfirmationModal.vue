<template>
  <div class="confirm-modal">
    <p>{{ message }}</p>
    <button class="primary" @click="handleConfirm">Confirm</button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";

const emit = defineEmits<(e: "closed") => void>();

const props = defineProps<{ message: string }>();

const store = useStore();

function handleConfirm() {
  emit("closed");
  const { onSuccess } = store.state.modal;
  store.commit(ModalMutationTypes.HIDE_MODAL);

  if (onSuccess) onSuccess();
}
</script>

<style lang="scss" scoped>
.confirm-modal {
  padding: 1rem;
  padding-top: 0;
  max-width: 320px;

  p {
    color: map-get($gray, 400);
    margin-bottom: 1rem;
    text-align: center;
  }
  button {
    display: block;
    margin: auto;
  }
}
</style>
