<template>
  <div class="hero-form">
    <form class="input-group" @submit.prevent>
      <input type="text" placeholder="Your room id" />
      <button type="submit" class="primary-outlined">Join</button>
    </form>
    <!-- <form>
      <button type="submit" class="primary-outlined">Join a room</button>
    </form> -->
    <p class="text-primary d-md-none">or</p>
    <form @submit.prevent="shouldShowAuth = true">
      <button type="submit" class="primary">Create a room</button>
    </form>
  </div>
  <auth-modal v-model:should-show="shouldShowAuth"></auth-modal>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent, ref } from "vue";
import AuthModal from "./AuthModal.vue";

export default defineComponent({
  components: { AuthModal },
  setup() {
    console.log(useStore().state.username);
    return {
      shouldShowAuth: ref(false),
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