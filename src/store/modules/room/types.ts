import { AvatarURLS } from "@/store/modules/auth/types";
import { WebSocketUser } from "@/plugins/WebSockets/types";
import { RTCDCClient } from "@/plugins/RTC/RTCDCClient";

export interface RoomMember {
  connection: RTCPeerConnection;
  identity: { username: string; avatar: AvatarURLS };
  stream: MediaStream;
  dataChannel: RTCDCClient;
}

export interface RoomState {
  id?: string;
  members: Map<string, RoomMember>;
  waitingMembers: Array<WebSocketUser>;
}

export enum RoomMutationTypes {
  SET_ID = "SET_ROOM_ID",
  ADD_MEMBER = "ADD_ROOM_MEMBER",
  REMOVE_MEMBER = "REMOVE_ROOM_MEMBER",
  ADD_WAITING_MEMBER = "ADD_ROOM_WAITING_MEMBER",
  REMOVE_WAITING_MEMBER = "REMOVE_ROOM_WATING_MEMBER",
}
