import fetch from "cross-fetch";
import NodeCache from "node-cache";
import { ApiPlayer } from "../typings/apiPlayer";
import { idToUuid } from "./idToUuid";

const nameCache = new NodeCache({
  stdTTL: 3 * 24 * 60 * 60, // * 3 days
  checkperiod: 24 * 60 * 60, // * 1 day
});
const uuidCache = new NodeCache({
  stdTTL: 3 * 24 * 60 * 60, // * 3 days
  checkperiod: 24 * 60 * 60, // * 1 day
});

export async function getPlayer(player: string) {
  if (
    nameCache.has(player.toLowerCase()) ||
    uuidCache.has(player.toLowerCase())
  )
    return nameCache.has(player.toLowerCase())
      ? (nameCache.get(player.toLowerCase()) as ApiPlayer)
      : (uuidCache.get(player.toLowerCase()) as ApiPlayer);

  return await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${player}`
  )
    .then((data: any) => data.json())
    .then(async (apiPlayer: ApiPlayer) => {
      nameCache.set(apiPlayer.name.toLowerCase(), apiPlayer);
      uuidCache.set((await idToUuid(apiPlayer.id)).toLowerCase(), apiPlayer);
      return apiPlayer;
    })
    .catch(async () => {
      return await fetch(
        `https://sessionserver.mojang.com/session/minecraft/profile/${player}`
      )
        .then((data: any) => data.json())
        .then(async (apiPlayer: ApiPlayer) => {
          nameCache.set(apiPlayer.name.toLowerCase(), apiPlayer);
          uuidCache.set(
            (await idToUuid(apiPlayer.id)).toLowerCase(),
            apiPlayer
          );
          return apiPlayer;
        })
        .catch(() => {
          return;
        });
    });
}
