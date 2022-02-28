import { Event } from "../structures/Event";

export default new Event("ready", (client) => {
  console.log(`Bot has logged in as ${client.user.tag}`);
});
