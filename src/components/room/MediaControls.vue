<template>
  <div class="media-controls">
    <button class="secondary" @click="toggleVideo">
      <base-icon :icon="mediaState.isVideoEnabled ? mdiVideo : mdiVideoOff" />
    </button>
    <button class="secondary" @click="toggleAudio">
      <base-icon
        :icon="mediaState.isAudioEnabled ? mdiMicrophone : mdiMicrophoneOff"
      />
    </button>
    <button class="secondary" @click="toggleVideoDevice">
      <base-icon :icon="mdiCameraFlip" />
    </button>
    <!-- <div class="media-controls__layout-change d-flex bg-dark">
      <button class="text-white large" @click="expandLayout()">
      </button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import {
  MediaActionTypes,
  MediaMutationTypes,
} from "@/store/modules/media/types";
import {
  mdiCameraFlip,
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiVideo,
  mdiVideoOff,
} from "@mdi/js";
import { computed } from "vue";
import BaseIcon from "../base/BaseIcon.vue";

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
</script>

<style lang="scss" scoped>
.media-controls {
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(3, 4rem);
  gap: 0.5rem;
  button {
    height: 4rem;
    display: grid;
    place-content: center;
  }
}
</style>
