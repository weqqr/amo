import { Reader } from "../serialization.ts";
import { ConnectionError } from "./connection.ts";

export const PROTOCOL_ID = 0x4f457403;

export type Peer = number & { type: "Peer" };
export type Channel = number & { type: "Channel" };
export type Sequence = number & { type: "Sequence" };

export interface Control {
  type: "control";
}

export interface Original {
  type: "original";
}

export interface Split {
  type: "split";
}

export class Frame {
  peer: Peer;
  channel: Channel;
  header: Control | Original | Split;
  reliability?: Sequence;
  payload: Uint8Array;

  constructor(reader: Reader) {
    const protocol_id = reader.readUint32();
    if (protocol_id != PROTOCOL_ID) {
      throw new ConnectionError(`invalid protocol version: ${protocol_id}`);
    }

    this.peer = reader.readUint16() as Peer;
    this.channel = reader.readUint8() as Channel;

    let frameType = reader.readUint8();
    if (frameType == 3) {
      this.reliability = reader.readUint16() as Sequence;
      frameType = reader.readUint8();
    }

    switch (frameType) {
      case 0:
        throw "unimplemented control";
      case 1:
        this.header = { type: "original" };
        break;
      case 2:
        throw "unimplemented split";
      default:
        throw new ConnectionError(`unknown frame type: ${frameType}`);
    }

    this.payload = reader.readToEnd();
  }
}
