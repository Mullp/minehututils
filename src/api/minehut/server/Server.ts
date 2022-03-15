import { ServerResponse } from "./ServerResponse";
import { ServerProperties } from "./ServerProperties";
import { Minehut } from "../Minehut";

export class Server {
  client: Minehut;

  categories: string[];
  inheritedCategories: string[];
  backupSlots: number;
  suspended: boolean;
  serverVersionType: string;
  proxy: string;
  connectedServers: string[];
  id: string;
  motd: string;
  visibility: boolean;
  serverPlan: string;
  storageNode: string;
  owner: string;
  name: string;
  nameLower: string;
  createdAt: number;
  platform: string;
  creditsPerDay: number;
  __v: number;
  port: number;
  lastOnline: number;
  online: boolean;
  maxPlayers?: number;
  playerCount: number;
  rawPlan: string;
  activeServerPlan: string;

  offer?: string;
  serverProperties?: ServerProperties;
  players?: string[];

  raw: ServerResponse;

  constructor(server: ServerResponse, client: Minehut) {
    this.client = client;

    this.categories = server.categories;
    this.inheritedCategories = server.inheritedCategories;
    this.backupSlots = server.backup_slots;
    this.suspended = server.suspended;
    this.serverVersionType = server.server_version_type;
    this.proxy = server.proxy;
    this.connectedServers = server.connectedServers;
    this.id = server._id;
    this.motd = server.motd;
    this.visibility = server.visibility;
    this.serverPlan = server.server_plan;
    this.storageNode = server.storage_node;
    this.owner = server.owner;
    this.name = server.name;
    this.nameLower = server.name_lower;
    this.createdAt = server.creation;
    this.platform = server.platform;
    this.creditsPerDay = server.credits_per_day;
    this.__v = server.__v;
    this.port = server.port;
    this.lastOnline = server.last_online;
    this.online = server.online;
    this.maxPlayers = server.maxPlayers;
    this.playerCount = server.playerCount;
    this.rawPlan = server.rawPlan;
    this.activeServerPlan = server.activeServerPlan;

    this.offer = server.offer;
    this.serverProperties = server.server_properties;
    this.players = server.players;

    this.raw = server;
  }

  async getRank() {
    return await this.client
      .getServers()
      .then((res) => {
        const rank = res?.servers
          .sort((a, b) =>
            a.playerData.playerCount < b.playerData.playerCount ? 1 : -1
          )
          .findIndex((server) => this.name === server.name);

        return rank ? rank + 1 : 0;
      })
      .catch(() => {
        return 0;
      });
  }

  async getMaxPlayers() {
    return this.maxPlayers
      ? this.maxPlayers
      : this.activeServerPlan === "YEARLY MH Unlimited"
      ? 500
      : this.activeServerPlan === "MH Unlimited"
      ? 500
      : this.activeServerPlan === "MH75"
      ? 75
      : this.activeServerPlan === "MH35"
      ? 35
      : this.activeServerPlan === "MH20"
      ? 20
      : this.activeServerPlan === "Daily"
      ? 20
      : this.activeServerPlan === "Free"
      ? 10
      : 10;
  }

  async getPurchasedIcons() {
    return await this.client.icons.fetch(this.raw.purchased_icons);
  }

  async getActiveIcon() {
    return (await this.client.icons.fetch([this.raw.active_icon]))[0];
  }

  async getInstalledContent() {
    const allAddons = await this.client.addons.fetchAll();
    const installedIds = this.raw.installed_content?.map((c) => c.content_id);
    return installedIds?.map((id) => allAddons?.find((a) => a.id === id)!);
  }
}
