import { createStore, Store, useStore as baseUseStore } from "vuex";
import { InjectionKey } from "vue";

import { TypedStore } from "./types";
import { RootState } from "./types";
import { authModule } from "./modules/auth";
import { modalModule } from "./modules/modal";
import { roomModule } from "./modules/room";

export const key: InjectionKey<Store<RootState>> = Symbol();

export function useStore(): TypedStore {
  return baseUseStore(key) as TypedStore;
}

const store: Store<RootState> = createStore({
  modules: { auth: authModule, modal: modalModule, room: roomModule },
});

export default store;
