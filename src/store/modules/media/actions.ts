import { RootState } from "@/store/types";
import { ActionContext, ActionTree } from "vuex";
import {
  MediaActionTypes,
  MediaMutationTypes,
  MediaState,
  MediaStreamTracks,
} from "./types";

export type MediaActions<C = ActionContext<MediaState, RootState>> = {
  [MediaActionTypes.INITIALIZE_MEDIA]: (context: C) => void;
  [MediaActionTypes.TOGGLE_VIDEO_DEVICE]: (
    context: C
  ) => Promise<MediaStreamTracks>;
};

export const actions: MediaActions & ActionTree<MediaState, RootState> = {
  [MediaActionTypes.INITIALIZE_MEDIA](context) {
    // Load video devices
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((d) => d.kind === "videoinput");
      context.commit(MediaMutationTypes.SET_VIDEO_DEVICES, videoDevices);

      // Set stream
      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: videoDevices[0].deviceId },
          audio: true,
        })
        .then((stream) =>
          context.commit(MediaMutationTypes.SET_STREAM, stream)
        );
    });
  },

  [MediaActionTypes.TOGGLE_VIDEO_DEVICE](context) {
    return new Promise((resolve) => {
      context.commit(MediaMutationTypes.TOGGLE_VIDEO_DEVICE);
      context.state.stream?.getTracks().forEach((tr) => tr.stop());
      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: context.state.activeVedioDeviceId },
        })
        .then((stream) => {
          context.commit(MediaMutationTypes.SET_STREAM, stream);
          resolve({
            videoTracks: stream.getVideoTracks(),
            audioTracks: stream.getAudioTracks(),
          });
        });
    });
  },
};
