import { RootState } from "@/store/types";
import { Module } from "vuex";
import { mutations } from "./mutations";
import { RoomState } from "./types";

export const roomModule: Module<RoomState, RootState> = {
  namespaced: false,
  state: {
    waitingMembers: [],
    members: new Map(),
  },
  mutations,
};
