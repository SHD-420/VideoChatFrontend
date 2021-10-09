import { useStore } from "@/store";
import { useRoomHelpers } from "./RoomHelpers";
import { useRtcHelpers } from "./rtcHelpers";
import { WSClient } from "./wsclient";

const wsclient = new WSClient();

export function useWebSockets() {
  const store = useStore();
  return {
    ...useRoomHelpers(wsclient, store),
    ...useRtcHelpers(wsclient, store),
  };
}
