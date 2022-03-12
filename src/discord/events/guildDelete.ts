import { inlineCode } from "@discordjs/builders";
import { webhookClient } from "../..";
import { Event } from "../structures/Event";

export default new Event("guildDelete", (event) => {
  webhookClient.send({
    username: "Logs",
    avatarURL:
      "https://578310-1874326-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2020/03/pine-logs-enhance-home.jpg",
    content: `Bot has left ${inlineCode(event.name)}`,
  });
});
