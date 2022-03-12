import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionRow, Modal, TextInputComponent } from "discord.js";
import { Command } from "../structures/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Submit feedback to the Minehut Utils team."),

  run: async ({ interaction }) => {
    await interaction.showModal(
      new Modal()
        .setCustomId("feedback")
        .setTitle("Submit feedback")
        .setComponents(
          new ActionRow<TextInputComponent>().addComponents(
            new TextInputComponent()
              .setCustomId("subject")
              .setLabel("Feedback subject")
              .setPlaceholder("Bug, Feature request or other (please describe)")
              .setRequired(true)
              .setStyle(1)
          ),
          new ActionRow<TextInputComponent>().addComponents(
            new TextInputComponent()
              .setCustomId("feedback")
              .setLabel("feedback")
              .setPlaceholder("The feedback")
              .setRequired(true)
              .setStyle(2)
          ),
          new ActionRow<TextInputComponent>().addComponents(
            new TextInputComponent()
              .setCustomId("contact")
              .setLabel("Can we contact you; if information is needed?")
              .setPlaceholder("Yes or no")
              .setRequired(true)
              .setStyle(1)
              .setMaxLength(3)
          )
        )
    );
  },
});
