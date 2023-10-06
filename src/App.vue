<template>
  <div id="app">
    <router-view></router-view>
    <base-modal/>
  </div>
</template>

<script setup lang="ts">
import BaseModal from "./components/base/BaseModal.vue";
</script>

<style lang="scss">
#app {
  display: block;
}
</style>
