import {
  ApplicationCommandOptionChoice,
  CommandInteractionOptionResolver,
} from "discord.js";
import { client, minehut } from "../..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../../typings/command";

export default new Event("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await interaction.deferReply();
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.followUp("This command doesn't exist!");

    command.run({
      args: interaction.options as CommandInteractionOptionResolver,
      client,
      interaction: interaction as ExtendedInteraction,
    });
  } else if (interaction.isAutocomplete()) {
    if (interaction.responded) return;

    const autocompletion = client.autocompletions.get(interaction.commandName);
    if (!autocompletion) return;

    autocompletion.run(interaction).catch();

    // const players = (await minehut.getPlayers())
    //   .filter((uuid) =>
    //     uuid.startsWith(interaction.options.getString("player") || "")
    //   )
    //   .splice(0, 25)
    //   .map(
    //     (player) =>
    //       ({
    //         name: player,
    //         value: player,
    //       } as ApplicationCommandOptionChoice)
    //   );

    // await interaction.respond(players);
  }
});
