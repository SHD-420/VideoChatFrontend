<template>
  <div class="default-layout">
    <div class="default-layout__videos">
      <div class="default-layout__active-video">
        <base-video
          :isVideoEnabled="activeMemberData.isVideoEnabled"
          :stream="activeMemberData.stream"
          :user="activeMemberData.identity"
          :isMuted="true"
        ></base-video>
      </div>
      <default-layout-side-bar @leave-room-requested="leaveRoom" />
      <div class="default-layout__my-video shadow-dark" @click="pinSelfVideo">
        <base-video
          :isSizeSmall="true"
          :isVideoEnabled="selfMemberData.isVideoEnabled"
          :stream="selfMemberData.stream"
          :user="selfMemberData.identity"
          :isMuted="true"
        ></base-video>
      </div>
    </div>
    <media-controls></media-controls>
  </div>
</template>

<script lang="ts">
import BaseVideo from "@/components/room/BaseVideo.vue";
import { UserIdentity } from "@/plugins/RTC/types";
import { RouteNames } from "@/router/types";
import { useStore } from "@/store";
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import DefaultLayoutSideBar from "./DefaultLayoutSideBar.vue";
import MediaControls from "./MediaControls.vue";

export default defineComponent({
  props: {
    activeMemberId: {
      type: String,
      default: null,
    },
  },
  components: { DefaultLayoutSideBar, BaseVideo, MediaControls },
  emits: ["self-pinned"],
  setup(props, { emit }) {
    const router = useRouter();
    const store = useStore();

    function pinSelfVideo() {
      emit("self-pinned");
    }
    function leaveRoom() {
      router.push({ name: RouteNames.Home });
    }

    const selfMemberData = computed(() => ({
      isVideoEnabled: store.state.media.isVideoEnabled,
      stream: store.state.media.stream as MediaStream,
      identity: store.state.auth as UserIdentity,
    }));

    const activeMemberData = computed(
      () =>
        store.state.room.members.get(props.activeMemberId) ||
        selfMemberData.value
    );

    return {
      selfMemberData,
      activeMemberData,
      pinSelfVideo,
      leaveRoom,
    };
  },
});
</script>

<style scoped lang="scss">
.default-layout {
  $self: &;
  &__videos {
    @include overlap-children;
  }
  &__my-video {
    // @extend .m-sm;
    width: 8rem;
    height: 10rem;
    border-radius: 0.25rem;
    z-index: 1;
    justify-self: end;
    overflow: hidden;
  }
  &__active-video {
    width: 100%;
    height: 30rem;
  }
}
</style>