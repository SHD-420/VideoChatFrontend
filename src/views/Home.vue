<template>
  <div class="home-view">
    <hero-section ref="heroSection"></hero-section>
    <overview-section
      @go-up-clicked="$refs.heroSection.$el.scrollIntoView()"
    ></overview-section>
  </div>
</template>

<script lang="ts">
import HeroSection from "@/components/home/HeroSection.vue";
import OverviewSection from "@/components/home/OverviewSection.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { HeroSection, OverviewSection },
  setup() {},
});
</script>

<style scoped lang="scss">
@include media-queries.home-view;
</style>