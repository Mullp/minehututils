import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../structures/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Submit feedback to the Minehut Utils team."),

  run: async ({ interaction }) => {},
});
