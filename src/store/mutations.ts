import { MutationTree } from "vuex";
import {
  AvatarURLS,
  LocalStorageKeys,
  MutationTypes,
  RootState,
} from "./types";

export type Mutations<S = RootState> = {
  [MutationTypes.SET_AVATAR](state: S, payload: AvatarURLS): void;
  [MutationTypes.SET_USERNAME](state: S, payload: string): void;
};

export const mutations: MutationTree<RootState> & Mutations = {
  [MutationTypes.SET_AVATAR]: (state, payload) => {
    state.avatar = payload;
    localStorage.setItem(LocalStorageKeys.AVATAR, payload);
  },
  [MutationTypes.SET_USERNAME]: (state, payload) => {
    state.username = payload;
    localStorage.setItem(LocalStorageKeys.USERNAME, payload);
  },
};
