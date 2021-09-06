import {
  CommitOptions,
  createStore,
  Store,
  useStore as baseUseStore,
} from "vuex";
import { InjectionKey } from "vue";

import { AvatarURLS, LocalStorageKeys, RootState } from "./types";
import { Mutations, mutations } from "./mutations";

export const key: InjectionKey<Store<RootState>> = Symbol();

export function useStore(): TypedStore {
  return baseUseStore(key) as TypedStore;
}

const store: Store<RootState> = createStore({
  state: {
    avatar:
      (localStorage.getItem(LocalStorageKeys.AVATAR) as AvatarURLS) ||
      AvatarURLS.DEFAULT,
    username: localStorage.getItem(LocalStorageKeys.USERNAME),
  },
  mutations,
});

export type TypedStore = Omit<Store<RootState>, "commit"> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
};

export default store;
