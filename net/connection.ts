import * as log from "std/log/mod.ts";
import { Reader } from "../serialization.ts";
import { Frame } from "./frame.ts";

export class ConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConnectionError";
  }
}

export class Connection {
  handlePacket(data: Uint8Array, address: Deno.NetAddr) {
    log.debug(`Received from ${address.hostname}:${address.port}: ${data}`);

    const frame = new Frame(new Reader(data));

    console.log(frame);
  }
}
