import { WebSocketUser } from "@/plugins/WebSockets/types";
import { MutationTree } from "vuex";
import { RoomMember, RoomMutationTypes, RoomState } from "./types";

export type RoomMutations<S = RoomState> = {
  [RoomMutationTypes.SETUP_ROOM]: (
    state: S,
    payload: { id: string; isMeOwner: boolean }
  ) => void;

  [RoomMutationTypes.RESET_ROOM]: (state: S) => void;

  [RoomMutationTypes.ADD_WAITING_MEMBER]: (
    state: S,
    payload: WebSocketUser
  ) => void;

  [RoomMutationTypes.ADD_MEMBER]: (
    state: S,
    payload: { socketId: string; member: RoomMember }
  ) => void;

  [RoomMutationTypes.SET_IS_AUDIO_ON]: (
    state: S,
    payload: { socketId: string; newVal: boolean }
  ) => void;
  [RoomMutationTypes.SET_IS_VIDEO_ON]: (
    state: S,
    payload: { socketId: string; newVal: boolean }
  ) => void;

  [RoomMutationTypes.REMOVE_MEMBER]: (state: S, payload: string) => void;

  [RoomMutationTypes.REMOVE_WAITING_MEMBER]: (
    state: S,
    payload: string
  ) => void;
};

export const mutations: RoomMutations & MutationTree<RoomState> = {
  [RoomMutationTypes.SETUP_ROOM](state, payload) {
    state.isMeOwner = payload.isMeOwner;
    state.id = payload.id;
  },
  [RoomMutationTypes.RESET_ROOM](state) {
    delete state.id;
    delete state.isMeOwner;
    state.waitingMembers = [];
    for (let member of state.members.values()) member.connection.close();
    state.members = new Map();
  },
  [RoomMutationTypes.ADD_MEMBER](state, payload) {
    state.members?.set(payload.socketId, payload.member);
  },
  [RoomMutationTypes.SET_IS_AUDIO_ON](state, payload) {
    const member = state.members?.get(payload.socketId);
    if (member) member.isAudioEnabled = payload.newVal;
  },
  [RoomMutationTypes.SET_IS_VIDEO_ON](state, payload) {
    const member = state.members?.get(payload.socketId);
    if (member) member.isVideoEnabled = payload.newVal;
  },
  [RoomMutationTypes.REMOVE_MEMBER](state, payload) {
    const member = state.members.get(payload);
    if (member) {
      member.connection.close();
      state.members.delete(payload);
    }
    state.members.delete(payload);
  },

  [RoomMutationTypes.ADD_WAITING_MEMBER](state, payload) {
    if (!state.waitingMembers.some((m) => m.socketId === payload.socketId))
      state.waitingMembers?.push(payload);
  },
  [RoomMutationTypes.REMOVE_WAITING_MEMBER](state, payload) {
    state.waitingMembers = state.waitingMembers?.filter(
      (m) => m.socketId !== payload
    );
  },
};
