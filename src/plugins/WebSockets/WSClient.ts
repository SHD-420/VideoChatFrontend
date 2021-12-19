import { IncomingMessageTypes } from "./types";

type WSEventHandler = (data: any) => void;
interface WSIncommingMessage {
  type: IncomingMessageTypes;
  data?: any;
}
interface WSOutgoingMessage {
  type: string;
  data?: any;
}

export class WSClient {
  // private _ws = new WebSocket("ws://localhost:8000");
  // private _ws = new WebSocket("ws://192.168.43.196:8000");
  private _ws = new WebSocket("wss://video-chat-websocket-backend.herokuapp.com");
  private _socketId?: string;
  private _eventMapping: Array<{
    event: IncomingMessageTypes;
    handler: WSEventHandler;
  }> = [];
  private _scheduledEmits: Array<WSOutgoingMessage> = [];

  constructor() {
    this._ws.onmessage = (messageEvent) => {
      const message = JSON.parse(messageEvent.data) as WSIncommingMessage;
      if (message.type === IncomingMessageTypes.CONNECTION_SUCCESS) {
        this._socketId = message.data;
        return;
      }
      const event = this._eventMapping.find((ev) => ev.event === message.type);
      if (event) event.handler(message.data);
    };

    this._ws.onopen = () => {
      this._scheduledEmits.forEach((data) =>
        this._ws.send(JSON.stringify(data))
      );
      this._scheduledEmits = [];
    };
  }

  on(event: IncomingMessageTypes, handler: WSEventHandler) {
    // overwrite the handler if already present else push new {event:handler}
    const index = this._eventMapping.findIndex((ev) => ev.event === event);
    if (index === -1) this._eventMapping.push({ event, handler });
    else this._eventMapping[index].handler = handler;
  }

  emit(data: WSOutgoingMessage) {
    if (this._ws.readyState !== WebSocket.OPEN) {
      this._scheduledEmits.push(data);
      return;
    }
    this._ws.send(JSON.stringify(data));
  }

  get socketId() {
    return this._socketId;
  }
}
