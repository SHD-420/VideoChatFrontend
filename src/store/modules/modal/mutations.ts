import AuthModal from "@/components/home/AuthModal.vue";
import MediaModal from "@/components/modals/MediaModal.vue";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";
import MessageModal from "@/components/modals/MessageModal.vue";
import { h as render, markRaw } from "vue";

import { MutationTree } from "vuex";
import { ModalMutationTypes, ModalState } from "./types";

export type ModalMutations<S = ModalState> = {
  [ModalMutationTypes.SHOW_MODAL](state: S): void;
  [ModalMutationTypes.HIDE_MODAL](state: S): void;
  [ModalMutationTypes.SHOW_AUTH_MODAL](state: S, payload?: () => void): void;
  [ModalMutationTypes.SHOW_MEDIA_MODAL](state: S, payload?: () => void): void;
  [ModalMutationTypes.SHOW_LEAVE_ROOM_CONFIRMATION](
    state: S,
    payload?: () => void
  ): void;
  [ModalMutationTypes.SHOW_REMOVE_MEMBER_CONFIRMATION](
    state: S,
    payload?: { onConfirmed?: () => void; memberName?: string }
  ): void;
  [ModalMutationTypes.SHOW_JOINING_MODAL](state: S): void;
  [ModalMutationTypes.SHOW_JOIN_ERROR_MODAL](state: S): void;
  [ModalMutationTypes.SHOW_GOT_REMOVED_MODAL](state: S): void;
  [ModalMutationTypes.SHOW_ROOM_CLOSED_MODAL](state: S): void;
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
    state.isClosable = true;
  },
  [ModalMutationTypes.SHOW_MEDIA_MODAL](state, onSuccess?) {
    state.component = markRaw(MediaModal);
    state.onSuccess = onSuccess;
    state.shouldShow = true;
    state.isClosable = true;
  },
  [ModalMutationTypes.SHOW_LEAVE_ROOM_CONFIRMATION](state, onSuccess?) {
    state.component = markRaw(
      render(ConfirmationModal, {
        message: "Are you sure that you want to leave?",
      })
    );
    state.onSuccess = onSuccess;
    state.shouldShow = true;
    state.isClosable = true;
  },
  [ModalMutationTypes.SHOW_REMOVE_MEMBER_CONFIRMATION](state, payload) {
    state.component = markRaw(
      render(ConfirmationModal, {
        message: `Are you sure that you want to remove ${
          payload?.memberName || "the member"
        }?`,
      })
    );
    state.onSuccess = payload?.onConfirmed;
    state.isClosable = true;
    state.shouldShow = true;
  },
  [ModalMutationTypes.SHOW_JOINING_MODAL](state) {
    state.component = markRaw(
      render(MessageModal, {
        message: "Waiting for the room owner to let you in.",
        type: "loading",
      })
    );
    state.shouldShow = true;
    state.isClosable = false;
  },
  [ModalMutationTypes.SHOW_JOIN_ERROR_MODAL](state) {
    state.component = markRaw(
      render(MessageModal, {
        message: "Sorry, that room doesn't exist.",
        type: "error",
      })
    );
    state.shouldShow = true;
    state.isClosable = true;
  },
  [ModalMutationTypes.SHOW_GOT_REMOVED_MODAL](state) {
    state.component = markRaw(
      render(MessageModal, {
        message: "The owner has removed you.",
        type: "error",
      })
    );
    state.shouldShow = true;
    state.isClosable = true;
  },
  [ModalMutationTypes.SHOW_ROOM_CLOSED_MODAL](state) {
    state.component = markRaw(
      render(MessageModal, {
        message: "The room was closed.",
        type: "info",
      })
    );
    state.shouldShow = true;
    state.isClosable = true;
  },
};
