import { Connection } from "./net/mod.ts";
import * as log from "std/log/mod.ts";

class Server {
  #address: Deno.NetAddr;
  #socket: Deno.DatagramConn;
  #connections: Map<string, Connection> = new Map();

  constructor(host: string, port: number) {
    const address = {
      transport: "udp",
      hostname: host,
      port,
    } as const;
    this.#address = address;
    this.#socket = Deno.listenDatagram(address);
  }

  private getConnection(address: Deno.NetAddr): Connection {
    const addressStr = `${address.hostname}:${address.port}`;
    let connection = this.#connections.get(addressStr);
    if (!connection) {
      log.debug(`Creating new connection from ${addressStr}`);
      connection = new Connection();
      this.#connections.set(addressStr, connection);
    }

    return connection;
  }

  async run() {
    log.info(`Listening on ${this.#address.hostname}:${this.#address.port}`);

    for await (const [data, address] of this.#socket) {
      if (address.transport != "udp") {
        continue;
      }

      const connection = this.getConnection(address);
      connection.handlePacket(data, address);
    }
  }
}

if (import.meta.main) {
  log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG"),
    },
    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["console"],
      },
    },
  });

  const server = new Server("0.0.0.0", 30000);
  await server.run();
}
