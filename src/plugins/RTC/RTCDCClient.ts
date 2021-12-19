interface DCEventTypes {
  videostatechange: { newState: "on" | "off" };
  audiostatechange: { newState: "on" | "off" };
}

export class RTCDCClient {
  private _dc: RTCDataChannel;
  private _eventMapping: Map<keyof DCEventTypes, Array<(data: any) => void>> =
    new Map();
  private _handleOpen?: () => void = ()=>console.log("DCOPEN");

  private _init() {
    this._dc.addEventListener("open", () => {
      if (this._handleOpen) this._handleOpen();
    });

    this._dc.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        const handlers = this._eventMapping.get(
          message.type as keyof DCEventTypes
        );
        if (handlers) {
          handlers.forEach((h) => h(message.data));
        }
        console.log(message);
      } catch (error) {
        if (error instanceof SyntaxError) return;
      }
    });
  }

  constructor(dc: RTCDataChannel) {
    this._dc = dc;
    this._init();
  }
  static fromConnection(conn: RTCPeerConnection) {
    return new RTCDCClient(conn.createDataChannel("dc"));
  }

  on<K extends keyof DCEventTypes>(
    event: K,
    handler: (d: DCEventTypes[K]) => void
  ) {
    const prevHandlers = this._eventMapping.get(event);
    this._eventMapping.set(
      event,
      prevHandlers ? [...prevHandlers, handler] : [handler]
    );
  }

  emit<K extends keyof DCEventTypes>(event: K, data: DCEventTypes[K]) {
    this._dc.send(JSON.stringify({ type: event, data }));
  }

  onOpen(callback: () => void) {
    this._handleOpen = callback;
  }
}
