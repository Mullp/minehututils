import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  Intents,
} from "discord.js";
import { CommandType } from "../../typings/command";
import { glob } from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../../typings/client";
import { Event } from "./Event";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();

  constructor() {
    super({
      intents: ["GUILDS"],
      allowedMentions: { parse: [] },
      presence: {
        status: "online",
        activities: [
          {
            type: "LISTENING",
            name: "you  ʕ•ᴥ•ʔ",
          },
        ],
      },
    });
  }

  start() {
    this.registerModules();
    this.login(process.env.botToken);
  }

  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      this.guilds.cache
        .get(guildId)
        ?.commands.set(commands.map((command) => command.toJSON()));
      console.log(`Registerd commands to ${guildId}`);
    } else {
      this.application?.commands.set(
        commands.map((command) => command.toJSON())
      );
      console.log(`Registerd global commands`);
    }
  }

  async registerModules() {
    // * Commands
    const slashCommands: Omit<
      SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder,
      "addSubcommand" | "addSubcommandGroup"
    >[] = [];
    const commandFiles = await globPromise(
      `${__dirname}/../commands/*{.ts,.js}`
    );

    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(filePath);
      if (!command.data.name) return;

      this.commands.set(command.data.name, command);
      slashCommands.push(command.data);
    });

    this.on("ready", () => {
      if (["debug", "dev"].includes(process.env.enviroment))
        this.registerCommands({
          commands: slashCommands,
          guildId: process.env.guildId,
        });
    });

    // * Event
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);

    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    });
  }
}
