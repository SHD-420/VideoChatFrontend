export interface MediaState {
  stream?: MediaStream;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

export enum MediaMutationTypes {
  SET_STREAM = "SET_STREAM",
  TOGGLE_VIDEO = "TOGGLE_VIDEO",
  TOGGLE_AUDIO = "TOGGLE_AUDIO",
}
