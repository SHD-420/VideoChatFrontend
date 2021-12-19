import { WSClient } from "./WSClient";
import { IncomingMessageTypes, OutgoingMessageTypes } from "./types";
import { WebSocketUser } from "./types";
import { RoomMutationTypes } from "@/store/modules/room/types";
import { TypedStore } from "@/store/types";
import { UserIdentity } from "../RTC/types";

export function useRoomHelpers(wsclient: WSClient, store: TypedStore) {
  wsclient.on(IncomingMessageTypes.JOIN_REQ, (user: WebSocketUser) => {
    store.commit(RoomMutationTypes.ADD_WAITING_MEMBER, user);
  });

  function acceptJoinReq(socketId: string) {
    const roomId = store.state.room.id;
    if (roomId) {
      store.commit(RoomMutationTypes.REMOVE_WAITING_MEMBER, socketId);
      wsclient.emit({
        type: OutgoingMessageTypes.ACCEPT_JOIN_ROOM_REQ,
        data: { socketId, roomId },
      });
    }
  }

  function joinRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("joining room" + roomId);

      const { username, avatar } = store.state.auth;

      if (username && avatar) {
        const user: UserIdentity = { username, avatar };
        wsclient.emit({
          type: OutgoingMessageTypes.JOIN_ROOM_REQ,
          data: { user, roomId },
        });
      }

      wsclient.on(IncomingMessageTypes.ROOM_JOINED, (roomId: string) => {
        store.commit(RoomMutationTypes.SET_ID, roomId);
        resolve();
      });

      wsclient.on(IncomingMessageTypes.ROOM_JOIN_ERROR, () => {
        reject();
      });
    });
  }

  function createRoom(): Promise<void> {
    return new Promise((resolve, reject) => {
      wsclient.emit({ type: OutgoingMessageTypes.CREATE_ROOM });
      wsclient.on(IncomingMessageTypes.ROOM_CREATE_ERROR, () => reject());
      wsclient.on(IncomingMessageTypes.ROOM_CREATED, (roomId: string) => {
        store.commit(RoomMutationTypes.SET_ID, roomId);
        resolve();
      });
    });
  }

  return { createRoom, joinRoom, acceptJoinReq };
}
