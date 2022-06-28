import { WSClient } from "@/plugins/WebSockets/WSClient";
import { IncomingMessageTypes } from "@/plugins/WebSockets/types";
import { SignalingChannel } from "./SignalingChannel";
import { PrematureMember } from "./PrematureMember";
import { RoomMember, RoomMutationTypes } from "@/store/modules/room/types";
import { MediaState, UserIdentity } from "./types";
import { TypedStore } from "@/store/types";

const peers = new Map<string, PrematureMember>();

export function setupRTC(wsclient: WSClient, store: TypedStore) {
  const signaler = new SignalingChannel(wsclient);

  const getPremetureConfig = (id: string) => ({
    id,
    signaler,
    myIdentity: store.state.auth as UserIdentity,
    // We are sure to have "myStream" as truthy
    myStream: store.state.media.stream!,
    myMediaState: {
      audio: (store.state.media.isAudioEnabled ? "on" : "off") as MediaState,
      video: (store.state.media.isVideoEnabled ? "on" : "off") as MediaState,
    },
    onMatured: (member: RoomMember) => {
      store.commit(RoomMutationTypes.ADD_MEMBER, { socketId: id, member });
      // Subscribe to audio and video state changes
      member.dataChannel.onAudioStateChange(({ newState }) =>
        store.commit(RoomMutationTypes.SET_IS_AUDIO_ON, {
          socketId: id,
          newVal: newState === "on",
        })
      );
      member.dataChannel.onVideoStateChange(({ newState }) =>
        store.commit(RoomMutationTypes.SET_IS_VIDEO_ON, {
          socketId: id,
          newVal: newState === "on",
        })
      );

      peers.delete(id);
    },
  });

  wsclient.on(IncomingMessageTypes.NEW_ROOM_MEMBER, (memberId: string) => {
    // Send call
    peers.set(
      memberId,
      new PrematureMember({
        ...getPremetureConfig(memberId),
        isSender: true,
      })
    );
  });

  signaler.onmessage = async ({ description, candidate, source }) => {
    try {
      let shouldIgnoreOffer = false;

      let peer = peers.get(source);

      if (!peer) {
        // Receive call
        peer = new PrematureMember({
          ...getPremetureConfig(source),
          isSender: false,
        });
        peers.set(source, peer);
      }

      if (description) {
        const isOffer = description.type === "offer";
        const hasOfferCollision =
          isOffer &&
          (peer.isMakingOffer || peer.connection.signalingState !== "stable");
        shouldIgnoreOffer = !peer.isPolite && hasOfferCollision;

        if (shouldIgnoreOffer) return;

        await peer.connection.setRemoteDescription(description);
        if (isOffer) {
          await peer.connection.setLocalDescription();
          signaler.emit({
            target: source,
            description: peer.connection.localDescription,
          });
        }
      } else if (candidate) {
        try {
          await peer.connection.addIceCandidate(candidate);
        } catch (err) {
          if (!shouldIgnoreOffer) throw err;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
}
