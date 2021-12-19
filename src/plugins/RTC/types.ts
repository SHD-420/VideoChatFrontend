import { AvatarURLS } from "@/store/modules/auth/types";

export interface UserIdentity {
  username: string;
  avatar: AvatarURLS;
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
