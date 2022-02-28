import fetch from "cross-fetch";
import { ApiPlayer } from "../typings/apiPlayer";

export async function getId(playerName: string) {
  return fetch(`https://api.mojang.com/users/profiles/minecraft/${playerName}`)
    .then((data: any) => data.json())
    .then((player: ApiPlayer) => player.id)
    .catch(() => {
      return;
    });
}
