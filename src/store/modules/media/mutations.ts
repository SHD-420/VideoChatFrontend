import { MutationTree } from "vuex";
import { MediaMutationTypes, MediaState } from "./types";

export type MediaMutations<S = MediaState> = {
  [MediaMutationTypes.SET_STREAM]: (state: S, payload: MediaStream) => void;
  [MediaMutationTypes.SET_VIDEO_DEVICES]: (
    state: S,
    payload: Array<MediaDeviceInfo>
  ) => void;
  [MediaMutationTypes.TOGGLE_VIDEO]: (state: S) => void;
  [MediaMutationTypes.TOGGLE_VIDEO_DEVICE]: (state: S) => void;
  [MediaMutationTypes.TOGGLE_AUDIO]: (state: S) => void;
};

export const mutations: MediaMutations & MutationTree<MediaState> = {
  [MediaMutationTypes.SET_STREAM](state, payload) {
    state.isAudioEnabled = !payload.getAudioTracks().some((tr) => !tr.enabled);
    state.isVideoEnabled = !payload.getVideoTracks().some((tr) => !tr.enabled);
    state.stream = payload;
  },
  [MediaMutationTypes.SET_VIDEO_DEVICES](state, payload) {
    state.videoDevices = payload;
    if (payload.length) state.activeVedioDeviceId = payload[0].deviceId;
  },
  [MediaMutationTypes.TOGGLE_VIDEO](state) {
    if (state.stream) {
      state.stream.getVideoTracks().forEach((tr) => (tr.enabled = !tr.enabled));
      state.isVideoEnabled = !state.isVideoEnabled;
    }
  },
  [MediaMutationTypes.TOGGLE_VIDEO_DEVICE](state) {
    const { videoDevices: devices } = state;
    if (devices && devices.length > 1) {
      const currentDeviceIndex = devices.findIndex(
        (d) => d.deviceId === state.activeVedioDeviceId
      );
      state.activeVedioDeviceId =
        devices[Number(currentDeviceIndex === 0)].deviceId;
    }
  },
  [MediaMutationTypes.TOGGLE_AUDIO](state) {
    if (state.stream) {
      state.stream.getAudioTracks().forEach((tr) => (tr.enabled = !tr.enabled));
      state.isAudioEnabled = !state.isAudioEnabled;
    }
  },
};
