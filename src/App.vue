<template>
  <div id="app">
    <router-view></router-view>
    <base-modal />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style lang="scss">
#app {
  display: block;
}
</style>
