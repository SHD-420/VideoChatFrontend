import { MutationTree } from "vuex";
import { MediaMutationTypes, MediaState } from "./types";

export type MediaMutations<S = MediaState> = {
  [MediaMutationTypes.SET_STREAM]: (state: S, payload: MediaStream) => void;
  [MediaMutationTypes.TOGGLE_VIDEO]: (state: S) => void;
  [MediaMutationTypes.TOGGLE_AUDIO]: (state: S) => void;
};

export const mutations: MediaMutations & MutationTree<MediaState> = {
  [MediaMutationTypes.SET_STREAM](state, payload) {
    state.isAudioEnabled = !payload.getAudioTracks().some((tr) => !tr.enabled);
    state.isVideoEnabled = !payload.getVideoTracks().some((tr) => !tr.enabled);
    state.stream = payload;
  },
  [MediaMutationTypes.TOGGLE_VIDEO](state) {
    if (state.stream) {
      state.stream.getVideoTracks().forEach((tr) => (tr.enabled = !tr.enabled));
      state.isVideoEnabled = !state.isVideoEnabled;
    }
  },
  [MediaMutationTypes.TOGGLE_AUDIO](state) {
    if (state.stream) {
      state.stream.getAudioTracks().forEach((tr) => (tr.enabled = !tr.enabled));
      state.isAudioEnabled = !state.isAudioEnabled;
    }
  },
};
