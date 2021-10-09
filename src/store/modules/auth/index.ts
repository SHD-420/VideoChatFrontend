import { RootState } from "@/store/types";
import { Module } from "vuex";
import { mutations } from "./mutations";
import { AuthState } from "./types";
import { LocalStorageKeys, AvatarURLS } from "./types";

export const authModule: Module<AuthState, RootState> = {
  namespaced: false,
  state: {
    avatar:
      (localStorage.getItem(LocalStorageKeys.AVATAR) as AvatarURLS) ||
      AvatarURLS.DEFAULT,
    username: localStorage.getItem(LocalStorageKeys.USERNAME),
  },
  mutations,
};
