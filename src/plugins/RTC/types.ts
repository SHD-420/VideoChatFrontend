import { AvatarURLS } from "@/store/modules/auth/types";

export interface UserIdentity {
  username: string;
  avatar: AvatarURLS;
}

export type MediaState = "on" | "off";

export type IncomingRTCEventArg = {
  source: string;
  description?: RTCSessionDescription | null;
  candidate?: RTCIceCandidate | null;
};

export type OutgoingRTCEventArg = Omit<IncomingRTCEventArg, "source"> & {
  target: string;
};
