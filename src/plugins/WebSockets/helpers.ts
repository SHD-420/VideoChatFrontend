import { RoomMutationTypes } from "@/store/modules/room/types";
import { TypedStore } from "@/store/types";
import { UserIdentity } from "../RTC/types";
import { IncomingMessageTypes, OutgoingMessageTypes } from "./types";
import { WSClient } from "./WSClient";

export function useRoomHelpers(wsclient: WSClient, store: TypedStore) {
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
      const { username, avatar } = store.state.auth;

      if (username && avatar) {
        const user: UserIdentity = { username, avatar };
        wsclient.emit({
          type: OutgoingMessageTypes.JOIN_ROOM_REQ,
          data: { user, roomId },
        });
      }

      wsclient.on(IncomingMessageTypes.ROOM_JOINED, (roomId: string) => {
        store.commit(RoomMutationTypes.SETUP_ROOM, {
          id: roomId,
          isMeOwner: false,
        });
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
        store.commit(RoomMutationTypes.SETUP_ROOM, {
          id: roomId,
          isMeOwner: true,
        });
        resolve();
      });
    });
  }

  function leaveRoom() {
    wsclient.emit({ type: OutgoingMessageTypes.ME_DISCONNECTED });
    store.commit(RoomMutationTypes.RESET_ROOM);
  }

  function removeMember(member: string) {
    wsclient.emit({
      type: OutgoingMessageTypes.REMOVE_MEMBER,
      data: { roomId: store.state.room.id, socketId: member },
    });
  }

  return { createRoom, joinRoom, acceptJoinReq, removeMember, leaveRoom };
}
