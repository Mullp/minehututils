import { ApplicationCommandOptionChoice } from "discord.js";
import { minehut } from "../..";
import { Autocompletion } from "../structures/Autocompletion";

export default new Autocompletion("info", async (interaction) => {
  if (!(interaction.options.getSubcommand() === "server")) return;

  const servers = (await minehut.getServers()).servers
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

  await interaction.respond(servers);
});
