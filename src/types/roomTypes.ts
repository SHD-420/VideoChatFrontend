import { UserIdentity } from "@/plugins/RTC/types";

export interface MemberData {
  id: string;
  isVideoEnabled: boolean;
  identity: UserIdentity;
  stream: MediaStream;
}
