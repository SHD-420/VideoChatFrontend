<template>
  <div class="hero-form">
    <form class="input-group" @submit.prevent="joinRoom">
      <input type="text" placeholder="Your room id" v-model="roomIdInput" />
      <button type="submit" class="primary-outlined">Join</button>
    </form>
    <p class="text-primary d-md-none">or</p>
    <form @submit.prevent="createRoom">
      <button type="submit" class="primary">Create a room</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  emits: ["create-room-request", "join-room-request"],
  setup(_, { emit }) {
    const roomIdInput = ref("");

    function createRoom() {
      emit("create-room-request");
    }
    
    function joinRoom() {
      emit("join-room-request", roomIdInput.value);
    }

    return {
      roomIdInput,
      createRoom,
      joinRoom,
    };
  },
});
</script>

<style lang="scss" scoped>
.hero-form {
  $y-translation: 40%;
  margin: 0 1.5rem;
  transform: translateY(-40%);
  margin-bottom: -3rem;
  padding: 0.5rem 2rem;
  background-color: $light1;
  border-radius: 1rem;
  box-shadow: 0 0 4px rgba(black, 0.5);
  form {
    display: grid;
    margin: 2rem 0;
  }
}
@include media-queries.hero-section-form;
</style>