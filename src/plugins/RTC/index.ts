import { RoomMutationTypes } from "@/store/modules/room/types";
import { TypedStore } from "@/store/types";
import { RTCDCClient } from "../RTC/RTCDCClient";
import { WSClient } from "@/plugins/WebSockets/WSClient";

import {
  IncomingRTCAnswer,
  IncomingRTCIceCandidate,
  IncomingRTCOffer,
} from "./types";

import {
  IncomingMessageTypes,
  OutgoingMessageTypes,
} from "@/plugins/WebSockets/types";
import { PendingMembers } from "./PendingMembers";
import { useRTCHelpers } from "./helpers";
import { computed } from "vue";

/*
  --Purpose of "members" object--

  It stores necessary details about room members like RTCPeerConnection, their MediaStream,
  etc before they're written into store's members map.
  This is done to avoid bugs that arise due to wrong timing/overlapping of RTC events.
 */
const members = new PendingMembers();

export function setupRTC(wsclient: WSClient, store: TypedStore) {
  const myIdentity = computed(() => ({
    ...store.state.auth,
  }));

  members.onMemberReady((data) => {
    store.commit(RoomMutationTypes.ADD_MEMBER, data);
  });
  const helpers = useRTCHelpers(store, wsclient, members);

  wsclient.on(
    IncomingMessageTypes.NEW_ROOM_MEMBER,
    async (memberSocketId: string) => {
      const conn = helpers.createPeerConn();
      const dataChannel = RTCDCClient.fromConnection(conn);
      dataChannel.onOpen(() => helpers.setInitialStreamState(dataChannel));
      members.set(memberSocketId, { connection: conn, dataChannel });
      const offer = await conn.createOffer();
      await conn.setLocalDescription(offer);
      wsclient.emit({
        type: OutgoingMessageTypes.RTC_OFFER,
        data: { offer, identity: myIdentity.value, target: memberSocketId },
      });
    }
  );

  wsclient.on(
    IncomingMessageTypes.RTC_OFFER,
    async (data: IncomingRTCOffer) => {
      const conn = helpers.createPeerConn();
      members.set(data.source, {
        connection: conn,
        identity: data.sourceUser,
      });
      await conn.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await conn.createAnswer();
      await conn.setLocalDescription(answer);

      wsclient.emit({
        type: OutgoingMessageTypes.RTC_ANSWER,
        data: { answer, identity: myIdentity.value, target: data.source },
      });
    }
  );

  wsclient.on(
    IncomingMessageTypes.RTC_ANSWER,
    async (data: IncomingRTCAnswer) => {
      const conn = members.get(data.source)?.connection;
      if (conn) {
        await conn.setRemoteDescription(new RTCSessionDescription(data.answer));
        members.set(data.source, { identity: data.sourceUser });
      }
    }
  );

  wsclient.on(
    IncomingMessageTypes.RTC_ICE_CANDIDATE,
    async (data: IncomingRTCIceCandidate) => {
      const conn = members.get(data.source)?.connection;
      if (conn) await conn.addIceCandidate(data.candidate);
    }
  );

  wsclient.on(IncomingMessageTypes.ROOM_MEMBER_LEFT, (socketId: string) => {
    store.commit(RoomMutationTypes.REMOVE_MEMBER, socketId);
  });
  wsclient.on(IncomingMessageTypes.ROOM_DESTROYED, () => {
    console.log("Room destroyed...bakayaro!!");
  });
}
