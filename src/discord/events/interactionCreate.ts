import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "../..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../../typings/command";

export default new Event("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.followUp("This command doesn't exist!");

    await command
      .run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction,
      })
      .catch();
  } else if (interaction.isAutocomplete()) {
    if (interaction.responded) return;

    const autocompletion = client.autocompletions.get(interaction.commandName);
    if (!autocompletion) return;

    await autocompletion.run(interaction).catch(() => console.log("errored"));
  } else if (interaction.isButton()) {
    const button = client.buttons.get(interaction.customId);
    if (!button) return;

    await button.run(interaction).catch();
  } else if (interaction.isModalSubmit()) {
    const modal = client.modals.get(interaction.customId);
    if (!modal) return;

    await modal.run(interaction).catch();
  }
});
