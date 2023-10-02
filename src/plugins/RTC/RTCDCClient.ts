import { MediaState, UserIdentity } from "./types";

type MsgHandler<T = unknown> = (data: T) => void;

// Types for message data
type InitialMediaState = { audio: MediaState; video: MediaState };
type MediaStateChange = { newState: MediaState };
type Identity = UserIdentity;

export class RTCDCClient {
  private _dc;
  private _initListeners() {
    this._dc.addEventListener("open", () =>
      this._openHandlers.forEach((h) => h())
    );
    this._dc.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data) as {
          type: string;
          data: unknown;
        };
        const handlers = this._eventMapping[message.type];
        handlers.forEach((h) => h(message.data));
      } catch (error) {
        if (error instanceof SyntaxError) return;
      }
    });
  }

  constructor(dc: RTCDataChannel) {
    this._dc = dc;
    this._initListeners();
  }
  static fromConnection(conn: RTCPeerConnection) {
    return new RTCDCClient(conn.createDataChannel("dc"));
  }

  // "open" event listener
  private _openHandlers: Function[] = [];
  onOpen(f: Function) {
    this._openHandlers.push(f);
  }

  // Message senders
  private _sendMsg(type: string, d: unknown) {
    this._dc.send(JSON.stringify({ type, data: d }));
  }

  emitInitialMediaState = (d: InitialMediaState) => this._sendMsg("3", d);
  emitAudioStateChange = (d: MediaStateChange) => this._sendMsg("0", d);
  emitVideoStateChange = (d: MediaStateChange) => this._sendMsg("1", d);
  emitIdentity = (d: Identity) => this._sendMsg("2", d);

  // Message listeners
  private _initialMediaStateHandlers: MsgHandler[] = [];
  private _videoStateChangeHandlers: MsgHandler[] = [];
  private _audioStateChangeHandlers: MsgHandler[] = [];
  private _identityHandlers: MsgHandler[] = [];

  onVideoStateChange(f: MsgHandler<MediaStateChange>) {
    this._videoStateChangeHandlers.push(f as MsgHandler);
  }
  onAudioStateChange(f: MsgHandler<MediaStateChange>) {
    this._audioStateChangeHandlers.push(f as MsgHandler);
  }
  onIdentity(f: MsgHandler<Identity>) {
    this._identityHandlers.push(f as MsgHandler);
  }
  onInitialMediaState(f: MsgHandler<InitialMediaState>) {
    this._initialMediaStateHandlers.push(f as MsgHandler);
  }

  private _eventMapping: Record<string, MsgHandler[]> = {
    "0": this._audioStateChangeHandlers,
    "1": this._videoStateChangeHandlers,
    "2": this._identityHandlers,
    "3": this._initialMediaStateHandlers,
  };
}
