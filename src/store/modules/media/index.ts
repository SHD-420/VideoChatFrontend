import { RootState } from "@/store/types";
import { Module } from "vuex";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { MediaState } from "./types";

export const mediaModule: Module<MediaState, RootState> = {
  namespaced: false,
  state: {
    isAudioEnabled: false,
    isVideoEnabled: false,
  },
  mutations,
  actions,
};
