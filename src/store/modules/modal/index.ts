import { RootState } from "@/store/types";
import { Module } from "vuex";
import { ModalState } from "./types";
import { mutations } from "./mutations";

export const modalModule: Module<ModalState, RootState> = {
  namespaced: false,
  state: {  },
  mutations
};
