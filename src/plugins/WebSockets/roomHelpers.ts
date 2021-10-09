import { WSClient } from "./WSClient";
import { IncomingMessageTypes, OutgoingMessageTypes } from "./types";
import { WebSocketUser } from "./types";
import { RoomMutationTypes } from "@/store/modules/room/types";
import { TypedStore } from "@/store/types";

export function useRoomHelpers(wsclient: WSClient, store: TypedStore) {
  wsclient.on(IncomingMessageTypes.JOIN_REQ, (user: WebSocketUser) => {
    store.commit(RoomMutationTypes.ADD_WAITING_MEMBER, user);
  });


  function acceptJoinReq(socketId: string, roomId: string) {
    store.commit(RoomMutationTypes.REMOVE_WAITING_MEMBER, socketId);
    wsclient.emit({
      type: OutgoingMessageTypes.ACCEPT_JOIN_ROOM_REQ,
      data: { socketId, roomId },
    });
  }

  function joinRoom(roomId: string): Promise<void> {
    return new Promise((resolve) => {
      console.log("joining room" + roomId);

      const { username, avatar } = store.state.auth;
      const socketId = wsclient.socketId;

      if (username && avatar && socketId) {
        const user: WebSocketUser = { username, avatar, socketId };
        wsclient.emit({
          type: OutgoingMessageTypes.JOIN_ROOM_REQ,
          data: { user, roomId },
        });
      }

      wsclient.on(IncomingMessageTypes.ROOM_JOINED, (roomId: string) => {
        store.commit(RoomMutationTypes.SET_ID, roomId);
        resolve();
      });
    });
  }

  function createRoom(): Promise<void> {
    return new Promise((resolve, reject) => {
      wsclient.emit({ type: OutgoingMessageTypes.CREATE_ROOM });
      wsclient.on(IncomingMessageTypes.ROOM_ERROR, () => reject());
      wsclient.on(IncomingMessageTypes.ROOM_CREATED, (roomId: string) => {
        store.commit(RoomMutationTypes.SET_ID, roomId);
        resolve();
      });
    });
  }

  return { createRoom, joinRoom, acceptJoinReq };
}
