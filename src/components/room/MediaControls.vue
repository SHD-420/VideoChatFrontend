<template>
  <div class="media-controls d-flex">
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
    <button class="sharp primary large" @click="toggleVideoDevice">
      <label>
        <font-awesome-icon icon="rss"></font-awesome-icon>
      </label>
    </button>
    <!-- <div class="media-controls__layout-change d-flex bg-dark">
      <button class="text-white large" @click="expandLayout()">
        <font-awesome-icon icon="arrows-alt"></font-awesome-icon>
      </button>
    </div> -->
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import {
  MediaMutationTypes,
  MediaActionTypes,
} from "@/store/modules/media/types";
import { defineComponent, computed } from "vue";

export default defineComponent({
  setup() {
    const store = useStore();
    const mediaState = computed(() => store.state.media);

    function toggleVideo() {
      store.commit(MediaMutationTypes.TOGGLE_VIDEO);
      const newState = mediaState.value.isVideoEnabled ? "on" : "off";
      store.state.room.members.forEach((member) =>
        member.dataChannel.emitVideoStateChange({ newState })
      );
    }
    function toggleAudio() {
      store.commit(MediaMutationTypes.TOGGLE_AUDIO);
      const newState = mediaState.value.isAudioEnabled ? "on" : "off";
      store.state.room.members.forEach((member) =>
        member.dataChannel.emitAudioStateChange({ newState })
      );
    }

    function toggleVideoDevice() {
      store.dispatch(MediaActionTypes.TOGGLE_VIDEO_DEVICE).then((newTracks) => {
        let { audioTracks, videoTracks } = newTracks;
        store.state.room.members.forEach(({ connection }) => {
          connection.getSenders().forEach((sender) => {
            if (sender.track?.kind === "video" && videoTracks.length) {
              sender.replaceTrack(videoTracks[0]);
              videoTracks = videoTracks.slice(1);
            }
            if (sender.track?.kind === "audio" && audioTracks.length) {
              sender.replaceTrack(audioTracks[0]);
              audioTracks = audioTracks.slice(1);
            }
          });
        });
      });
    }

    return {
      mediaState,
      toggleVideoDevice,
      toggleVideo,
      toggleAudio,
    };
  },
});
</script>

<style lang="scss" scoped>
.media-controls {
  background-color: $dark1;
}
</style>
