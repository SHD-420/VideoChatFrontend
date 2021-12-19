import { TypedStore } from "@/store/types";
import { WSClient } from "@/plugins/WebSockets/WSClient";
import { PendingMembers } from "./PendingMembers";
import { RTCDCClient } from "./RTCDCClient";
import { OutgoingMessageTypes } from "@/plugins/WebSockets/types";

const iceConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useRTCHelpers(
  store: TypedStore,
  wsclient: WSClient,
  members: PendingMembers
) {
  function setInitialStreamState(dataChannel: RTCDCClient) {
    const myStream = store.state.media.stream;
    if (myStream)
      dataChannel.emit("videostatechange", {
        newState: myStream.getVideoTracks().some((tr) => !tr.enabled)
          ? "off"
          : "on",
      });
  }
  function createPeerConn() {
    const connection = new RTCPeerConnection(iceConfig);
    connection.addEventListener("icecandidate", (event) => {
      const { candidate, target } = event;
      const targetId = members.findByConn(target as RTCPeerConnection)?.[0];
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
    });

    connection.addEventListener("track", (event) => {
      const memberEntry = members.findByConn(event.target as RTCPeerConnection);

      if (memberEntry) {
        const [socketId, member] = memberEntry;
        const stream: MediaStream = member.stream || new MediaStream();
        connection.addTrack(event.track);
        stream.addTrack(event.track);
        members.set(socketId, { stream });
      }
    });

    connection.addEventListener("datachannel", (event) => {
      const [socketId] = members.findByConn(connection) || [];
      if (socketId) {
        const dataChannel = new RTCDCClient(event.channel);
        dataChannel.onOpen(() => setInitialStreamState(dataChannel));
        members.set(socketId, { dataChannel });
      }
    });

    const stream = store.state.media.stream;
    if (stream) {
      stream.getTracks().forEach((track) => connection.addTrack(track, stream));
    }

    return connection;
  }

  return { createPeerConn, setInitialStreamState };
}
