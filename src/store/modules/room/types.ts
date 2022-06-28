import { AvatarURLS } from "@/store/modules/auth/types";
import { WebSocketUser } from "@/plugins/WebSockets/types";
import { RTCDCClient } from "@/plugins/RTC/RTCDCClient";

export interface RoomMember {
  connection: RTCPeerConnection;
  identity: { username: string; avatar: AvatarURLS };
  stream: MediaStream;
  dataChannel: RTCDCClient;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

export interface RoomState {
  id?: string;
  isMeOwner?: boolean;
  members: Map<string, RoomMember>;
  waitingMembers: Array<WebSocketUser>;
}

export enum RoomMutationTypes {
  SETUP_ROOM = "SETUP_ROOM",
  RESET_ROOM = "RESET_ROOM",
  ADD_MEMBER = "ADD_ROOM_MEMBER",
  SET_IS_AUDIO_ON = "SET_IS_AUDIO_ON",
  SET_IS_VIDEO_ON = "SET_IS_VIDEO_ON",
  REMOVE_MEMBER = "REMOVE_ROOM_MEMBER",
  ADD_WAITING_MEMBER = "ADD_ROOM_WAITING_MEMBER",
  REMOVE_WAITING_MEMBER = "REMOVE_ROOM_WATING_MEMBER",
}
