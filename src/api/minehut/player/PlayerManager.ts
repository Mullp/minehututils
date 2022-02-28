import { getPlayer } from "../../../lib/getPlayer";
import { idToUuid } from "../../../lib/idToUuid";
import { Minehut } from "../Minehut";

export class PlayerManager {
  private client: Minehut;

  constructor(client: Minehut) {
    this.client = client;
  }

  async find(player: string, byUuid: boolean = true) {
    const servers = (await this.client.getServers())?.servers;
    if (!servers) return;

    const uuid: string = byUuid
      ? player
      : await idToUuid((await getPlayer(player))?.id || "");

    return servers.find((server) => server.playerData.players.includes(uuid));
  }
}
