<template>
  <div>
    <p>Count is {{counter}}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";

export default defineComponent({
  setup() {
    const counter: Ref<number> = ref(0);

    function increment() {
      counter.value++;
    }

    return { counter, increment };
  },
});
</script>

<style scoped>
</style>