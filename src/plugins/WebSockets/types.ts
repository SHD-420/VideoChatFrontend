import { AvatarURLS } from "@/store/modules/auth/types";

export enum IncomingMessageTypes {
  CONNECTION_SUCCESS = "CONNECTED",
  ROOM_CREATED = "CREATED_ROOM",
  ROOM_ERROR = "ROOM_ERROR",
  JOIN_REQ = "JOIN_ROOM_REQ",
  ROOM_JOINED = "JOINED_ROOM",
  NEW_ROOM_MEMBER = "NEW_MEMBER",
  ROOM_MEMBER_LEFT = "MEMBER_LEFT",
  ROOM_DESTROYED = "DESTROYED_ROOM",

  RTC_OFFER = "RTC_OFFER",
  RTC_ANSWER = "RTC_ANSWER",
  RTC_ICE_CANDIDATE = "RTC_ICE_CANDIDATE",
}

export enum OutgoingMessageTypes {
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM_REQ = "JOIN_ROOM",
  ACCEPT_JOIN_ROOM_REQ = "ACCEPT_JOIN_ROOM_REQ",
  RTC_OFFER = "RTC_OFFER",
  RTC_ANSWER = "RTC_ANSWER",
  RTC_ICE_CANDIDATE = "RTC_ICE_CANDIDATE",
}

export interface UserIdentity {
  username: string;
  avatar: AvatarURLS;
}

export interface WebSocketUser extends UserIdentity {
  socketId: string;
}


export interface IncomingRTCOffer {
  offer: RTCSessionDescriptionInit;
  source: string;
  sourceUser: UserIdentity
}

export interface IncomingRTCAnswer {
  answer: RTCSessionDescriptionInit;
  source: string;
  sourceUser: UserIdentity;
}

export interface IncomingRTCIceCandidate {
  candidate: RTCIceCandidate;
  source: string;
}
