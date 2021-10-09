import { RoomMember, RoomMutationTypes } from "@/store/modules/room/types";
import { TypedStore } from "@/store/types";

import {
  IncomingMessageTypes,
  IncomingRTCAnswer,
  IncomingRTCIceCandidate,
  IncomingRTCOffer,
  OutgoingMessageTypes,
  WebSocketUser,
} from "./types";
import { WSClient } from "./WSClient";

interface LocalScopeMember {
  connection?: RTCPeerConnection;
  identity?: {username:string,avatar:string};
  stream?: MediaStream;
}

const members = new Map<string, LocalScopeMember>();

const iceConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useRtcHelpers(wsclient: WSClient, store: TypedStore) {
  const myIdentity = {
    ...store.state.auth,
  };

  function setMember(
    socketId: string,
    arg: {
      [k in keyof LocalScopeMember]: LocalScopeMember[k];
    }
  ) {
    const member = members.get(socketId);
    if (member) {
      const data = { ...member, ...arg };
      members.set(socketId, data);
      if (data.connection && data.identity && data.stream) {
        store.commit(RoomMutationTypes.ADD_MEMBER, {
          socketId,
          member: data as RoomMember,
        });
      }
    } else members.set(socketId, arg);
  }

  async function getPeerConnection() {
    const connection = new RTCPeerConnection(iceConfig);
    connection.addEventListener("icecandidate", (event) => {
      const { candidate } = event;
      const targetId = Array.from(members.entries()).find(
        ([_, member]) => member.connection === event.target
      )?.[0];

      if (candidate && targetId) {
        wsclient.emit({
          type: OutgoingMessageTypes.RTC_ICE_CANDIDATE,
          data: { candidate, target: targetId },
        });
      }
    });

    connection.addEventListener("connectionstatechange", () => {
      console.log(
        `Connection state changed to :"${connection.connectionState}"`
      );
      switch (connection.connectionState) {
        case "connected":
          console.log("conntected....!!");
          break;
        case "closed":
          console.log("connection closed");

        default:
          break;
      }
    });

    connection.addEventListener("track", (event) => {
      const memberEntry = Array.from(members.entries()).find(
        ([_, m]) => m.connection === event.target
      );

      if (memberEntry) {
        const [socketId, member] = memberEntry;
        const stream: MediaStream = member.stream || new MediaStream();
        connection.addTrack(event.track);
        stream.addTrack(event.track);
        setMember(socketId, { stream });
      }
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    stream.getTracks().forEach((track) => connection.addTrack(track, stream));

    return connection;
  }

  wsclient.on(
    IncomingMessageTypes.NEW_ROOM_MEMBER,
    async (memberSocketId: string) => {
      const conn = await getPeerConnection();
      setMember(memberSocketId, { connection: conn });
      const offer = await conn.createOffer();
      await conn.setLocalDescription(offer);
      wsclient.emit({
        type: OutgoingMessageTypes.RTC_OFFER,
        data: { offer, identity: myIdentity, target: memberSocketId },
      });
    }
  );

  wsclient.on(
    IncomingMessageTypes.RTC_OFFER,
    async (data: IncomingRTCOffer) => {
      const conn = await getPeerConnection();
      setMember(data.source, {
        connection: conn,
        identity: data.sourceUser,
      });
      await conn.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await conn.createAnswer();
      await conn.setLocalDescription(answer);

      wsclient.emit({
        type: OutgoingMessageTypes.RTC_ANSWER,
        data: { answer, identity: myIdentity, target: data.source },
      });
    }
  );

  wsclient.on(
    IncomingMessageTypes.RTC_ANSWER,
    async (data: IncomingRTCAnswer) => {
      const conn = members.get(data.source)?.connection;
      if (conn) {
        await conn.setRemoteDescription(new RTCSessionDescription(data.answer));
        setMember(data.source, { identity: data.sourceUser });
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

  return {};
}
