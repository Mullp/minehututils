import { ApplicationCommandOptionChoice } from "discord.js";
import { minehut } from "../..";
import { Autocompletion } from "../structures/AutocompletionStructure";

export default new Autocompletion("playerlist", async (interaction) => {
  const servers = (await minehut.getServers())?.servers
    .map((server) => server.name)
    .filter((server) =>
      server
        .toLowerCase()
        .includes(interaction.options.getString("server")?.toLowerCase() || "")
    )
    .sort((a, b) => {
      const query = (
        interaction.options.getString("server") || ""
      ).toLowerCase();

      const bgnA = a.substring(0, query.length).toLowerCase();
      const bgnB = b.substring(0, query.length).toLowerCase();

      if (bgnA === query && bgnB !== query) return -1;
      if (bgnB === query) return 1;

      if (b.toLowerCase().includes(query)) return 1;
      if (a.toLowerCase().includes(query)) return -1;

      return a < b ? -1 : a > b ? 1 : 0;
    })
    .splice(0, 25)
    .map(
      (server) =>
        ({
          name: server,
          value: server,
        } as ApplicationCommandOptionChoice)
    );

  if (servers) await interaction.respond(servers);
});
