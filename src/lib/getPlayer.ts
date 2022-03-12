import fetch from "cross-fetch";
import NodeCache from "node-cache";
import { ApiPlayer } from "../typings/apiPlayer";
import { idToUuid } from "./idToUuid";

const nameCache = new NodeCache({
  stdTTL: 5 * 24 * 60 * 60, // * 5 days
  checkperiod: 24 * 60 * 60, // * 1 day
});
const uuidCache = new NodeCache({
  stdTTL: 5 * 24 * 60 * 60, // * 5 days
  checkperiod: 24 * 60 * 60, // * 1 day
});

export async function getPlayer(player: string) {
  if (
    nameCache.has(player.toLowerCase()) ||
    uuidCache.has(player.toLowerCase())
  ) {
    return nameCache.has(player.toLowerCase())
      ? (nameCache.get(player.toLowerCase()) as ApiPlayer)
      : (uuidCache.get(player.toLowerCase()) as ApiPlayer);
  }

  if (/^([a-zA-Z0-9_]{3,16})$/.test(player))
    return await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${player}`
    )
      .then((data: any) => data.json())
      .then(async (apiPlayer: ApiPlayer) => {
        nameCache.set(apiPlayer.name.toLowerCase(), apiPlayer);
        uuidCache.set(idToUuid(apiPlayer.id).toLowerCase(), apiPlayer);
        return apiPlayer;
      })
      .catch(() => {
        return;
      });

  if (
    /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/.test(
      player
    )
  )
    return await fetch(
      `https://sessionserver.mojang.com/session/minecraft/profile/${player}`
    )
      .then((data: any) => data.json())
      .then((apiPlayer) => {
        if (apiPlayer.path) return;

        nameCache.set(apiPlayer.name.toLowerCase(), apiPlayer);
        uuidCache.set(idToUuid(apiPlayer.id).toLowerCase(), apiPlayer);

        return apiPlayer as ApiPlayer;
      })
      .catch((err) => {
        return;
      });

  return;
}
