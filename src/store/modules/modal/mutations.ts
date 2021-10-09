import AuthModal from "@/components/home/AuthModal.vue";
import { markRaw } from "vue";

import { MutationTree } from "vuex";
import { ModalMutationTypes, ModalState } from "./types";

export type ModalMutations<S = ModalState> = {
  [ModalMutationTypes.SHOW_MODAL](state: S): void;
  [ModalMutationTypes.HIDE_MODAL](state: S): void;
  [ModalMutationTypes.SHOW_AUTH_MODAL](state: S, payload?: () => void): void;
};

export const mutations: MutationTree<ModalState> & ModalMutations = {
  [ModalMutationTypes.SHOW_MODAL](state) {
    if (state.component) state.shouldShow = true;
  },
  [ModalMutationTypes.HIDE_MODAL](state) {
    state.shouldShow = false;
    delete state.component;
    delete state.onSuccess;
  },
  [ModalMutationTypes.SHOW_AUTH_MODAL](state, onSuccess?) {
    state.component = markRaw(AuthModal);
    state.onSuccess = onSuccess;
    state.shouldShow = true;
  },
};
