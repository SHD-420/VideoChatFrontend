<template>
  <div class="base-video">
    <video
      class="base-video__stream"
      :srcObject.prop.camel="stream"
      :muted="isMuted"
      autoplay
    ></video>
    <h5 class="base-video__user-name" v-if="!isSizeSmall">
      {{ user.username }}
    </h5>
    <transition name="scale-fade">
      <img
        :src="user.avatar"
        v-if="!isVideoEnabled"
        class="base-video__user-avatar"
        :class="{ 'base-video__user-avatar--small': isSizeSmall }"
        alt=""
      />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { UserIdentity } from "@/plugins/RTC/types";

defineProps<{
  stream: MediaStream;
  user: UserIdentity;
  isVideoEnabled: boolean;
  isMuted?: boolean;
  isSizeSmall?: boolean;
  muted?: boolean;
}>();
</script>

<style lang="scss" scoped>
.base-video {
  @include overlap-children();
  @include sqr;
  grid-template: 100%/100%;
  &__stream {
    z-index: -1;
    @include sqr;
  }
  &__user-name {
    align-self: flex-end;
    color: map-get($gray, 800);
    background-color: $primary-light;
    width: max-content;
    padding: 0.5rem;
    margin: 0.5rem;
    border-radius: 0.25rem;
    font-size: 1rem;
  }
  &__user-avatar {
    @include sqr(8rem);
    border-radius: 50%;
    place-self: center;
    &--small {
      @include sqr(4rem);
    }
  }
}
</style>
