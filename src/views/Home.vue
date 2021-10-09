<template>
  <div class="home-view">
    <hero-section ref="heroSection"></hero-section>
    <overview-section @go-up-clicked="goUp"></overview-section>
  </div>
</template>

<script lang="ts">
import HeroSection from "@/components/home/HeroSection.vue";
import OverviewSection from "@/components/home/OverviewSection.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: { HeroSection, OverviewSection },
  setup() {
    const heroSection = ref<InstanceType<typeof HeroSection> | null>(null);
    const goUp = () => heroSection.value?.$el.scrollIntoView();
    return { goUp, heroSection };
  },
});
</script>

<style scoped lang="scss">
@include media-queries.home-view;
</style>