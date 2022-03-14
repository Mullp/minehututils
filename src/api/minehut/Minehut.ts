import fetch from "cross-fetch";
import { DEV_MINEHUT_API_BASE, MINEHUT_API_BASE } from "./constants";
import { ServerManager } from "./server/ServerManager";
import { IconManager } from "./icon/IconManager";
import { PluginManager } from "./plugin/PluginManager";
import { SimpleStatsResponse } from "./stats/SimpleStatsResponse";
import { PlayerDistributionResponse } from "./stats/PlayerDistributionResponse";
import { AddonManager } from "./addon/AddonManager";
import { ServersResponse } from "./servers/ServersResponse";
import { PlayerManager } from "./player/PlayerManager";
import { HomepageStatsResponse } from "./stats/HomepageStatsResponse";
import NodeCache from "node-cache";
import { getPlayer } from "../../lib/getPlayer";

export class Minehut {
  API_BASE: string;

  icons: IconManager;
  servers: ServerManager;
  plugins: PluginManager;
  addons: AddonManager;
  players: PlayerManager;

  playersCache: NodeCache;
  serversCache: NodeCache;

  constructor(settings: MinehutSettings = { dev: false }) {
    this.API_BASE = settings.dev ? DEV_MINEHUT_API_BASE : MINEHUT_API_BASE;

    this.icons = new IconManager(this);
    this.servers = new ServerManager(this);
    this.plugins = new PluginManager(this);
    this.addons = new AddonManager(this);
    this.players = new PlayerManager(this);

    this.playersCache = new NodeCache({
      stdTTL: 10 * 60, // * 10 minutes
      checkperiod: 2 * 60, // * 2 minute
    });

    this.serversCache = new NodeCache({
      stdTTL: 10 * 60, // * 10 minutes
      checkperiod: 2 * 60, // * 2 minute
    });
  }

  async getPlayers() {
    if (this.playersCache.has("players")) {
      return this.playersCache.get("players") as string[];
    }

    return await this.getServers()
      .then(async (res) => {
        const players = await this.getServers()
          .then((res) =>
            res?.servers
              .map((server) =>
                server.playerData.players.map((player) => player)
              )
              .flat(1)
              .filter((uuid) => !uuid.startsWith("00000000"))
          )
          .catch(() => {
            return;
          });

        this.playersCache.set("players", players);

        return players;
      })
      .catch(() => {
        return;
      });
  }

  async getServers() {
    if (this.serversCache.has("servers"))
      return this.serversCache.get("servers") as ServersResponse;

    return await fetch(`${this.API_BASE}/servers`)
      .then((res) => res.json())
      .then((res: ServersResponse) => {
        this.serversCache.set("servers", res);
        return res as ServersResponse;
      })
      .catch(() => {
        return;
      });
  }

  async getHomepageStats() {
    return await fetch(`${this.API_BASE}/network/homepage_stats`)
      .then((res) => res.json())
      .then((res: HomepageStatsResponse) => {
        return res;
      })
      .catch(() => {
        return;
      });
  }

  async getSimpleStats() {
    const res = await fetch(`${this.API_BASE}/network/simple_stats`);
    if (!res.ok) throw new Error(res.statusText);
    const json: SimpleStatsResponse = await res.json();
    const ramCount = parseFloat((json.ram_count / 1000).toFixed(1));
    return {
      serverCount: json.server_count,
      serverMax: json.server_max,
      playerCount: json.player_count,
      ramCount,
      ramMax: json.ram_max,
    };
  }

  async getPlayerDistribution() {
    const res = await fetch(`${this.API_BASE}/network/players/distribution`);
    if (!res.ok) throw new Error(res.statusText);
    const json: PlayerDistributionResponse = await res.json();
    return {
      bedrock: {
        total: json.bedrockTotal,
        lobby: json.bedrockLobby,
        playerServer: json.bedrockPlayerServer,
      },
      java: {
        total: json.javaTotal,
        lobby: json.javaLobby,
        playerServer: json.javaPlayerServer,
      },
    };
  }
}

export interface MinehutSettings {
  dev?: boolean;
}
