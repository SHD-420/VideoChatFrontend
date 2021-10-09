import { AuthState } from "./modules/auth/types";
import { CommitOptions, Store } from "vuex";
import { ModalState } from "./modules/modal/types";
import { AuthMutations } from "./modules/auth/mutations";
import { ModalMutations } from "./modules/modal/mutations";
import { RoomMutations } from "./modules/room/mutations";
import { RoomState } from "./modules/room/types";
import { RoomGetters } from "./modules/room/getters";

export interface RootState {
  auth: AuthState;
  modal: ModalState;
  room: RoomState;
}

type Mutations = AuthMutations & ModalMutations & RoomMutations;
type Getters = RoomGetters;

export type TypedStore = Omit<Store<RootState>, "commit" | "getters"> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;

  getters: {
    [k in keyof Getters]: ReturnType<Getters[k]>;
  };
};
