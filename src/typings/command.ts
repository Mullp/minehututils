import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  PermissionResolvable,
} from "discord.js";
import { ExtendedClient } from "../discord/structures/Client";

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
  data: Omit<
    SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder,
    "addSubcommand" | "addSubcommandGroup"
  >;
  userPermissions?: PermissionResolvable[];
  cooldown?: number;
  run: RunFunction;
};
