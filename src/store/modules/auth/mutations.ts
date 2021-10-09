import { MutationTree } from "vuex";
import {
  AvatarURLS,
  LocalStorageKeys,
  AuthMutationTypes,
  AuthState,
} from "./types";

export type AuthMutations<S = AuthState> = {
  [AuthMutationTypes.SET_AVATAR](state: S, payload: AvatarURLS): void;
  [AuthMutationTypes.SET_USERNAME](state: S, payload: string): void;
};

export const mutations: MutationTree<AuthState> & AuthMutations = {
  [AuthMutationTypes.SET_AVATAR]: (state, payload) => {
    state.avatar = payload;
    localStorage.setItem(LocalStorageKeys.AVATAR, payload);
  },
  [AuthMutationTypes.SET_USERNAME]: (state, payload) => {
    state.username = payload;
    localStorage.setItem(LocalStorageKeys.USERNAME, payload);
  },
};
