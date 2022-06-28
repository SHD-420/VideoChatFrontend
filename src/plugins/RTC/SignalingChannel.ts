import {
  IncomingMessageTypes,
  OutgoingMessageTypes,
} from "@/plugins/WebSockets/types";
import { WSClient } from "../WebSockets/WSClient";
import { IncomingRTCEventArg, OutgoingRTCEventArg } from "./types";

type RTCMsgHandler = (data: IncomingRTCEventArg) => void;

export class SignalingChannel {
  private _baseWSClient: WSClient;
  private _msgHandler: RTCMsgHandler;

  constructor(baseClient: WSClient) {
    this._baseWSClient = baseClient;
    this._msgHandler = () => {};
    baseClient.on(IncomingMessageTypes.RTC_EVENT, (d) => this._msgHandler(d));
  }

  emit(data: OutgoingRTCEventArg) {
    this._baseWSClient.emit({ type: OutgoingMessageTypes.RTC_EVENT, data });
  }

  set onmessage(msgHandler: RTCMsgHandler) {
    this._msgHandler = msgHandler;
  }
}
