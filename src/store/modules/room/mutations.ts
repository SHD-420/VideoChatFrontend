import { WebSocketUser } from "@/plugins/WebSockets/types";
import { MutationTree } from "vuex";
import { RoomMember, RoomMutationTypes, RoomState } from "./types";

export type RoomMutations<S = RoomState> = {
  [RoomMutationTypes.SET_ID]: (state: S, payload: string) => void;

  [RoomMutationTypes.ADD_WAITING_MEMBER]: (
    state: S,
    payload: WebSocketUser
  ) => void;

  [RoomMutationTypes.ADD_MEMBER]: (
    state: S,
    payload: { socketId: string; member: RoomMember }
  ) => void;

  [RoomMutationTypes.REMOVE_MEMBER]: (state: S, payload: string) => void;

  [RoomMutationTypes.REMOVE_WAITING_MEMBER]: (
    state: S,
    payload: string
  ) => void;
};

export const mutations: RoomMutations & MutationTree<RoomState> = {
  [RoomMutationTypes.SET_ID](state, payload) {
    state.id = payload;
  },
  [RoomMutationTypes.ADD_MEMBER](state, payload) {
    state.members?.set(payload.socketId, payload.member);
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
