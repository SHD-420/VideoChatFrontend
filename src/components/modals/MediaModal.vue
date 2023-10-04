<template>
  <div class="joining-modal">
    <video autoplay :srcObject.prop.camel="mediaState.stream" muted></video>
    <div class="joining-modal__btns">
      <button class="secondary" @click="TOGGLE_VIDEO()">
        <base-icon :icon="mediaState.isVideoEnabled ? mdiVideo : mdiVideoOff" />
      </button>
      <button class="secondary" @click="TOGGLE_AUDIO()">
        <base-icon
          :icon="mediaState.isAudioEnabled ? mdiMicrophone : mdiMicrophoneOff"
        />
      </button>
      <button
        @click="handleContinue()"
        class="primary"
        :disabled="!mediaState.stream"
      >
        Confirm
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import {
  MediaActionTypes,
  MediaMutationTypes,
} from "@/store/modules/media/types";
import { mapMutations } from "vuex";
import { ModalMutationTypes } from "@/store/modules/modal/types";
import {
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiVideo,
  mdiVideoOff,
} from "@mdi/js";
import BaseIcon from "../base/BaseIcon.vue";

export default defineComponent({
  emits: ["closed"],
  setup(_, { emit }) {
    const store = useStore();
    const mediaState = computed(() => store.state.media);
    function handleContinue() {
      const { onSuccess } = store.state.modal;
      emit("closed");
      store.commit(ModalMutationTypes.HIDE_MODAL);
      if (mediaState.value.stream && onSuccess) onSuccess();
    }
    store.dispatch(MediaActionTypes.INITIALIZE_MEDIA);
    return {
      mdiVideo,
      mdiVideoOff,
      mdiMicrophone,
      mdiMicrophoneOff,
      mediaState,
      handleContinue,
      ...mapMutations([
        MediaMutationTypes.TOGGLE_VIDEO,
        MediaMutationTypes.TOGGLE_AUDIO,
      ]),
    };
  },
  components: { BaseIcon },
});
</script>

<style scoped lang="scss">
.joining-modal {
  width: 512px;
  video {
    width: 100%;
    height: 240px;
    background-color: map-get($gray, 200);
  }
  &__btns {
    display: flex;
    align-items: center;
    padding: 1rem;
    :not(:last-child) {
      margin-right: 0.5rem;
      @include sqr(2.5rem);
      display: grid;
      place-content: center;
      font-size: 0.75rem;
    }
    :last-child {
      margin-left: auto;
    }
  }
}
</style>
