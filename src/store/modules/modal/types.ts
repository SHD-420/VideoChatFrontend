import { ComponentOptions } from "vue";

export interface ModalState {
  shouldShow?: boolean;
  onSuccess?: () => void;
  component?: ComponentOptions;
}

export enum ModalMutationTypes {
  SHOW_MODAL = "SHOW_MODAL",
  HIDE_MODAL = "HIDE_MODAL",
  SHOW_AUTH_MODAL = "SHOW_AUTH_MODAL",
}
