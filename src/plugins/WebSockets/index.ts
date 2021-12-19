import { useStore } from "@/store";
import { setupRTC } from "../RTC";
import { useRoomHelpers } from "./helpers";
import { WSClient } from "./wsclient";

const wsclient = new WSClient();

export function useWebSockets() {
  const store = useStore();
  setupRTC(wsclient,store);
  return {
    ...useRoomHelpers(wsclient, store)
  };
}
