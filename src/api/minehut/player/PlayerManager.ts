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
    const uuid = byUuid
      ? player
      : idToUuid((await getPlayer(player))?.id || "");

    if (!servers) return;
    return (
      await Promise.all(
        servers.map((server) =>
          server.playerData.players.includes(uuid) ? server : undefined
        )
      )
    ).filter((element) => element);
  }
}
