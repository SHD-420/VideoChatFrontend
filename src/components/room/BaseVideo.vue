<template>
  <div class="base-video">
    <video
      class="base-video__stream"
      :srcObject.prop.camel="stream"
      autoplay
    ></video>
    <h5 class="base-video__user-name text-medium p-xs" v-if="!isSizeSmall">
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

<script lang="ts">
import { UserIdentity } from "@/plugins/RTC/types";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    stream: {
      type: Object as PropType<MediaStream>,
      required: true,
    },
    user: {
      type: Object as PropType<UserIdentity>,
      required: true,
    },
    isVideoEnabled: {
      type: Boolean,
      required: true,
    },
    isSizeSmall: {
      type: Boolean,
      default: false,
    },
    muted:{
      type: Boolean,
      default: false,
    }
  },
});
</script>

<style lang="scss" scoped>
.base-video {
  @include overlap-children();
  @include sqr;
  grid-template: 100%/100%;

  &__stream {
    z-index: -1;
    @include sqr;
    background: $dark1;
  }
  &__user-name {
    align-self: flex-end;
    color: $light3;
    font-size: 0.75rem;
    background: rgba($dark1, 0.5);
    @include sqr(max-content);
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