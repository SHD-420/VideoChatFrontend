<template>
  <div class="default-layout">
    <div class="default-layout__videos">
      <div class="default-layout__active-video">
        <base-video
          :isVideoEnabled="activeMemberData.isVideoEnabled"
          :stream="activeMemberData.stream"
          :user="activeMemberData.identity"
        ></base-video>
      </div>
      <default-layout-side-bar @leave-room-requested="leaveRoom" />
      <div class="default-layout__my-video shadow-dark" @click="pinSelfVideo">
        <base-video
          :isSizeSmall="true"
          :isVideoEnabled="selfMemberData.isVideoEnabled"
          :stream="selfMemberData.stream"
          :user="selfMemberData.identity"
        ></base-video>
      </div>
    </div>
    <div class="default-layout__controls d-flex">
      <button class="sharp primary large" @click="toggleVideo">
        <font-awesome-icon
          :icon="mediaState.isVideoEnabled ? 'video' : 'video-slash'"
        ></font-awesome-icon>
      </button>
      <button class="sharp secondary large" @click="toggleAudio">
        <font-awesome-icon
          :icon="mediaState.isAudioEnabled ? 'microphone' : 'microphone-slash'"
        ></font-awesome-icon>
      </button>
      <div class="default-layout__layout-change d-flex bg-dark">
        <button class="text-white large" @click="expandLayout()">
          <font-awesome-icon icon="arrows-alt"></font-awesome-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "@/store";
import { MediaMutationTypes } from "@/store/modules/media/types";
import DefaultLayoutSideBar from "./DefaultLayoutSideBar.vue";
import BaseVideo from "@/components/room/BaseVideo.vue";
import { MemberData } from "@/types/roomTypes";
import { UserIdentity } from "@/plugins/RTC/types";
import { useRouter } from "vue-router";
import { RouteNames } from "@/router/types";

export default defineComponent({
  props: {
    activeMember: {
      type: Object as PropType<MemberData | null>,
      default: null,
    },
  },
  components: { DefaultLayoutSideBar, BaseVideo },
  emits: ["layout-change-requested", "self-pinned"],
  setup(props, { emit }) {
    const router = useRouter();
    const store = useStore();
    const mediaState = computed(() => store.state.media);

    function toggleVideo() {
      store.commit(MediaMutationTypes.TOGGLE_VIDEO);
      const newState = store.state.media.isVideoEnabled ? "on" : "off";
      store.state.room.members.forEach((member) =>
        member.dataChannel.emit("videostatechange", { newState })
      );
    }
    function toggleAudio() {
      store.commit(MediaMutationTypes.TOGGLE_AUDIO);
      const newState = store.state.media.isAudioEnabled ? "on" : "off";
      store.state.room.members.forEach((member) =>
        member.dataChannel.emit("audiostatechange", { newState })
      );
    }

    function expandLayout() {
      emit("layout-change-requested");
    }

    function pinSelfVideo() {
      console.log("self pinned");
      emit("self-pinned");
    }
    function leaveRoom() {
      router.push({ name: RouteNames.Home });
    }

    const selfMemberData = computed(() => ({
      isVideoEnabled: mediaState.value.isVideoEnabled,
      stream: mediaState.value.stream as MediaStream,
      identity: store.state.auth as UserIdentity,
    }));

    return {
      selfMemberData,
      activeMemberData: computed(
        () => props.activeMember || selfMemberData.value
      ),
      mediaState,
      pinSelfVideo,
      toggleVideo,
      toggleAudio,
      expandLayout,
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
    @extend .m-sm;
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

  &__controls {
    #{$self}__layout-change {
      flex-grow: 1;
      justify-content: flex-end;
    }
  }
}
</style>