import { ServerProperties } from "./ServerProperties";

interface InstalledContent {
  pinned: boolean;
  _id: string;
  content_id: string;
  content_version_id: string;
  install_date: string;
  last_updated: string;
}

export interface ServerResponse {
  categories: string[];
  inheritedCategories: string[];
  purchased_icons: string[];
  backup_slots: number;
  suspended: boolean;
  server_version_type: string;
  proxy: string;
  connectedServers: string[];
  _id: string;
  motd: string;
  visibility: boolean;
  server_plan: string;
  storage_node: string;
  owner: string;
  name: string;
  name_lower: string;
  creation: number;
  platform: string;
  credits_per_day: number;
  __v: number;
  port: number;
  last_online: number;
  active_icon: string;
  icon: string;
  online: boolean;
  maxPlayers?: number;
  playerCount: number;
  rawPlan: string;
  activeServerPlan: string;

  offer?: string;
  server_properties?: ServerProperties;
  installed_content?: InstalledContent[];
  players?: string[];
}
