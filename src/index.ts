import "dotenv/config";
import { ExtendedClient } from "./discord/structures/Client";
import { Minehut } from "./api/minehut/index";
import { WebhookClient } from "discord.js";
import mongoDbConnect from "./database/connect";

export const client = new ExtendedClient();
export const webhookClient = new WebhookClient({ url: process.env.webhookUrl });
export const minehut = new Minehut();

client.start();
mongoDbConnect({ db: process.env.mongoUri });
