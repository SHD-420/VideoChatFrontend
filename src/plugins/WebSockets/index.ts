import { useRouter } from "@/router";
import { RouteNames } from "@/router/types";
import { useStore } from "@/store";
import { ModalMutationTypes } from "@/store/modules/modal/types";
import { RoomMutationTypes } from "@/store/modules/room/types";
import { setupRTC } from "../RTC";
import { useRoomHelpers } from "./helpers";
import { IncomingMessageTypes, WebSocketUser } from "./types";
import { WSClient } from "./WSClient";

const wsclient = new WSClient();

export function useWebSockets() {
  const store = useStore();

  const router = useRouter();

  wsclient.on(IncomingMessageTypes.JOIN_REQ, (user: WebSocketUser) => {
    store.commit(RoomMutationTypes.ADD_WAITING_MEMBER, user);
  });

  wsclient.on(IncomingMessageTypes.ROOM_MEMBER_LEFT, (member: string) => {
    store.commit(RoomMutationTypes.REMOVE_MEMBER, member);
  });

  wsclient.on(
    IncomingMessageTypes.ROOM_MEMBER_GOT_REMOVED,
    (member: string) => {
      store.commit(RoomMutationTypes.REMOVE_MEMBER, member);
    }
  );

  wsclient.on(IncomingMessageTypes.ME_GOT_REMOVED, () => {
    store.commit(RoomMutationTypes.RESET_ROOM);
    store.commit(ModalMutationTypes.SHOW_GOT_REMOVED_MODAL);
    router.push({ name: RouteNames.Home });
  });

  wsclient.on(IncomingMessageTypes.ROOM_DESTROYED, () => {
    store.commit(RoomMutationTypes.RESET_ROOM);
    store.commit(ModalMutationTypes.SHOW_ROOM_CLOSED_MODAL);
    router.push({ name: RouteNames.Home });
  });

  setupRTC(wsclient, store);
  return {
    ...useRoomHelpers(wsclient, store),
  };
}
