<template>
  <div class="hero">
    <div class="hero__head">
      <img
        src="@/assets/images/home-mobile.svg"
        class="hero__mobile-bg d-md-none"
      />
      <div class="hero__title">
        <h1>FlashRooms</h1>
        <div class="hero__tagline">
          <span class="hero__dot"></span>
          <p>A video chat solution that requires barely any setup</p>
          <span class="hero__dot"></span>
        </div>
      </div>
    </div>
    <div class="hero__body">
      <img src="@/assets/images/home-image.svg" class="d-none d-md-inline" />
      <hero-section-form
        @create-room-request="createRoom"
        @join-room-request="joinRoom"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import HeroSectionForm from "./HeroSectionForm.vue";

export default defineComponent({
  components: { HeroSectionForm },
  emits: ["create-room-request", "join-room-request"],
  setup(_, { emit }) {
    function createRoom() {
      emit("create-room-request");
    }
    function joinRoom(roomId: string) {
      emit("join-room-request", roomId);
    }

    return { createRoom, joinRoom };
  },
});
</script>

<style scoped lang="scss">
.hero {
  $self: &;
  text-align: center;
  &__head {
    display: grid;
    grid-template: 1/1;
    color: $light1;
    #{$self}__mobile-bg {
      max-height: 75vh;
    }
    & > * {
      grid-row-start: 1;
      grid-column-start: 1;
    }

    #{$self}__title {
      margin-top: 10vh;
      padding: 0 1.5rem;
      #{$self}__tagline {
        width: fit-content;
        margin: auto;
        margin-top: 3rem;
        display: flex;
        align-items: center;
      }
    }
  }
}
@include media-queries.hero-section;
</style>