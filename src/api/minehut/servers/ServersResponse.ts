export interface ServersServerResponse {
  maxPlayers?: number;
  name: string;
  motd: string;
  icon?: string;
  visibility: boolean;
  saveData: { lastSave: number };
  playerData: { players: string[]; playerCount: number; timeNoPlayers: number };
  hibernationData: { hibernationPrepStartTime: number };
  serverGraceUnlock: boolean;
  podInfo: { instance: string; "instance-sidecar": string };
  podType: string;
  serverVersionType: string;
  proxyAuth: {};
  connectable: boolean;
  namespace: string;
}

export interface ServersResponse {
  servers: ServersServerResponse[];
  total_players: number;
  total_servers: number;
}
