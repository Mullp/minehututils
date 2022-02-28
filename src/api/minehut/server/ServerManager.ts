import { Minehut } from "../Minehut";
import fetch from "cross-fetch";
import { Server } from "./Server";
import { ServerResponse } from "./ServerResponse";
import NodeCache from "node-cache";

const nameCache = new NodeCache({
  stdTTL: 10 * 60, // * 10 minutes
  checkperiod: 1 * 60, // * 1 minute
});
const idCache = new NodeCache({
  stdTTL: 10 * 60, // * 10 minutes
  checkperiod: 1 * 60, // * 1 minute
});

export class ServerManager {
  client: Minehut;

  constructor(client: Minehut) {
    this.client = client;
  }

  async get(server: string, byName: boolean = true) {
    if (
      nameCache.has(server.toLowerCase()) ||
      idCache.has(server.toLowerCase())
    )
      return nameCache.has(server.toLowerCase())
        ? new Server(
            nameCache.get(server.toLowerCase()) as ServerResponse,
            this.client
          )
        : new Server(
            idCache.get(server.toLowerCase()) as ServerResponse,
            this.client
          );

    return await fetch(
      `${this.client.API_BASE}/server/${server}${byName ? "?byName=true" : ""}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty("ok")) return;

        const apiServer: ServerResponse = res.server;
        nameCache.set(apiServer.name.toLowerCase(), apiServer);
        idCache.set(apiServer._id.toLowerCase(), apiServer);

        return new Server(apiServer, this.client);
      })
      .catch(() => {
        return;
      });
  }
}
