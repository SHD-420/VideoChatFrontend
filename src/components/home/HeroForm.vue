<template>
  <form class="form">
    <button
      class="primary form__create"
      @click.prevent="emit('create-room-requested')"
    >
      <span> Create new room </span>
      <span>
        <font-awesome-icon icon="plus"></font-awesome-icon>
      </span>
    </button>
    <div class="form__line"></div>
    <div class="form__join">
      <p>Or join using room code:</p>
      <div class="form__roomid">
        <input
          type="text"
          placeholder="Enter code here"
          v-model="roomIdInput"
        />
        <button
          :disabled="isRoomIdInValid"
          @click.prevent="emit('join-room-requested', roomIdInput)"
        >
          <font-awesome-icon icon="arrow-right"></font-awesome-icon>
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

const emit = defineEmits<{
  (e: "create-room-requested"): void;
  (e: "join-room-requested", d: string): void;
}>();

const roomIdInput = ref("");

const isRoomIdInValid = computed(() => roomIdInput.value.length !== 6);
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/home/HeroForm.scss';
@include media-queries.hero-form;
</style>
