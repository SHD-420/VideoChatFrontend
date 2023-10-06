import { RoomMember } from "@/store/modules/room/types";
import { RTCDCClient } from "./RTCDCClient";
import { SignalingChannel } from "./SignalingChannel";
import { MediaState, UserIdentity } from "./types";

type PrematureMemberConfig = {
  id: string;
  myStream: MediaStream;
  myIdentity: UserIdentity;
  myMediaState: {
    audio: MediaState;
    video: MediaState;
  };
  isSender: boolean;
  signaler: SignalingChannel;
  onMatured: (d: RoomMember) => void;
};

export class PrematureMember {
  connection: RTCPeerConnection;
  isPolite: boolean;
  isMakingOffer: boolean;
  private _id: string;
  private _stream?: MediaStream;
  private _dc?: RTCDCClient;
  private _identity?: UserIdentity;
  private _initialMediaState?: PrematureMemberConfig["myMediaState"];
  private _signaler: SignalingChannel;
  private _handleMatured: PrematureMemberConfig["onMatured"];

  constructor(config: PrematureMemberConfig) {
    this._id = config.id;
    this.isMakingOffer = false;
    this._signaler = config.signaler;
    this._handleMatured = config.onMatured;

    const conn = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    this.connection = conn;

    // Call sending peer should be polite
    // and receiving peer should be impolite
    this.isPolite = config.isSender;

    // Add "my" _stream to the connection
    config.myStream
      .getTracks()
      .forEach((track) => conn.addTrack(track, config.myStream));

    conn.addEventListener("track", this._handleTrack.bind(this));
    conn.addEventListener(
      "negotiationneeded",
      this._handleNegotiationNeeded.bind(this)
    );
    conn.addEventListener("icecandidate", this._handleIceCandite.bind(this));

    // Setup data channel and further user _identity
    if (config.isSender) {
      this._dc = RTCDCClient.fromConnection(conn);
      this._dc.onOpen(() =>
        this._handleDCOpen(config.myIdentity, config.myMediaState)
      );
    } else
      conn.addEventListener("datachannel", ({ channel }) => {
        this._dc = new RTCDCClient(channel);
        this._dc.onOpen(() =>
          this._handleDCOpen(config.myIdentity, config.myMediaState)
        );
      });
  }

  private _handleTrack({ streams: [_stream], track }: RTCTrackEvent) {
    track.addEventListener("unmute", () => {
      if (!this._stream) {
        this._stream = _stream;
        this._handleIfMatured();
      }
    });
  }

  private async _handleNegotiationNeeded() {
    try {
      this.isMakingOffer = true;
      // @ts-ignore
      await this.connection.setLocalDescription();
      this._signaler.emit({
        target: this._id,
        description: this.connection.localDescription,
      });
    } catch (err) {
      console.log(err);
    } finally {
      this.isMakingOffer = false;
    }
  }

  private _handleIceCandite({ candidate }: RTCPeerConnectionIceEvent) {
    this._signaler.emit({
      target: this._id,
      candidate,
    });
  }

  private _handleDCOpen(
    myIdentity: UserIdentity,
    myMediaState: PrematureMemberConfig["myMediaState"]
  ) {
    const dc = this._dc;
    if (dc) {
      dc.emitIdentity(myIdentity);
      dc.emitInitialMediaState(myMediaState);
      dc.onIdentity((i) => {
        this._identity = i;
        this._handleIfMatured();
      });
      dc.onInitialMediaState((ms) => {
        this._initialMediaState = ms;
        this._handleIfMatured();
      });
    }
  }

  private _handleIfMatured() {
    if (this._dc && this._identity && this._stream && this._initialMediaState)
      this._handleMatured({
        identity: this._identity,
        stream: this._stream,
        dataChannel: this._dc,
        connection: this.connection,
        isVideoEnabled: this._initialMediaState.video === "on",
        isAudioEnabled: this._initialMediaState.audio === "on"
      });
  }
}
