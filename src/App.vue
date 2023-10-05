<template>
  <div id="app">
    <router-view></router-view>
    <base-modal/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseModal from "./components/base/BaseModal.vue";

export default defineComponent({
    name: "App",
    components: { BaseModal }
});
</script>

<style lang="scss">
#app {
  display: block;
}
</style>
