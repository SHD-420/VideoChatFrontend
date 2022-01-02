export interface MediaState {
  stream?: MediaStream;
  videoDevices?: Array<MediaDeviceInfo>;
  activeVedioDeviceId?: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

export interface MediaStreamTracks {
  videoTracks: Array<MediaStreamTrack>;
  audioTracks: Array<MediaStreamTrack>;
}

export enum MediaMutationTypes {
  SET_STREAM = "SET_STREAM",
  SET_VIDEO_DEVICES = "SET_VIDEO_DEVICES",
  TOGGLE_VIDEO = "TOGGLE_VIDEO",
  TOGGLE_VIDEO_DEVICE = "TOGGLE_VIDEO_DEVICE",
  TOGGLE_AUDIO = "TOGGLE_AUDIO",
}

export enum MediaActionTypes {
  INITIALIZE_MEDIA = "INITIALIZE_MEDIA",
  TOGGLE_VIDEO_DEVICE = "TOGGLE_VIDEO_DEVICE",
}
