import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";

export interface RegisterCommandsOptions {
  guildId?: string;
  commands: Omit<
    SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder,
    "addSubcommand" | "addSubcommandGroup"
  >[];
}
