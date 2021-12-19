import { AuthState } from "./modules/auth/types";
import { CommitOptions, Store } from "vuex";
import { ModalState } from "./modules/modal/types";
import { AuthMutations } from "./modules/auth/mutations";
import { ModalMutations } from "./modules/modal/mutations";
import { RoomMutations } from "./modules/room/mutations";
import { RoomState } from "./modules/room/types";
import { MediaMutations } from "./modules/media/mutations";
import { MediaState } from "./modules/media/types";

export interface RootState {
  auth: AuthState;
  modal: ModalState;
  room: RoomState;
  media: MediaState;
}

type Mutations = AuthMutations &
  ModalMutations &
  RoomMutations &
  MediaMutations;

export type TypedStore = Omit<Store<RootState>, "commit" | "getters"> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
};
