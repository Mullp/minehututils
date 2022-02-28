import "dotenv/config";
import { ExtendedClient } from "./discord/structures/Client";
import { Minehut } from "./api/minehut/index";

export const client = new ExtendedClient();
export const minehut = new Minehut();

client.start();

// (async () => {
//   console.log(
//     await minehut.players.find("e36d1e16-72f5-4338-b12a-e3fbc7f1d1be")
//   );
// })();

// MongoDB connect
// mongoDbConnect({ db: process.env.mongoUri });
