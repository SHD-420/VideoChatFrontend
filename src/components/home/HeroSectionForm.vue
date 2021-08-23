<template>
  <div class="hero-form">
    <form class="input-group">
      <input type="text" placeholder="Your room id" />
      <button type="submit" class="primary-outlined" @click.prevent>
        Join
      </button>
    </form>
    <!-- <form>
      <button type="submit" class="primary-outlined">Join a room</button>
    </form> -->
    <p class="text-primary d-md-none">or</p>
    <form>
      <button type="submit" class="primary">Create a room</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
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