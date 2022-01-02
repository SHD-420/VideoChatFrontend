<template>
  <div class="joining-modal">
    <video autoplay :srcObject.prop.camel="mediaState.stream" muted></video>
    <div class="joining-modal__control-btns my-lg">
      <button class="primary icon" @click="TOGGLE_VIDEO()">
        <font-awesome-icon
          :icon="mediaState.isVideoEnabled ? 'video' : 'video-slash'"
        ></font-awesome-icon>
      </button>
      <button class="primary icon" @click="TOGGLE_AUDIO()">
        <font-awesome-icon
          :icon="mediaState.isAudioEnabled ? 'microphone' : 'microphone-slash'"
        ></font-awesome-icon>
      </button>
    </div>
    <button
      @click="handleContinue()"
      class="joining-modal__confirm-btn d-block primary"
      :disabled="!mediaState.stream"
    >
      Confirm
    </button>
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
      mediaState,
      handleContinue,
      ...mapMutations([
        MediaMutationTypes.TOGGLE_VIDEO,
        MediaMutationTypes.TOGGLE_AUDIO,
      ]),
    };
  },
});
</script>

<style scoped lang="scss">
.joining-modal {
  // width: max-content;
  &__confirm-btn {
    width: 100%;
  }
  &__control-btns {
    justify-content: center;
    column-gap: 2rem;
    grid-auto-flow: column;
    display: grid;
    align-content: center;
  }
}
</style>