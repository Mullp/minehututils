import {
  ActivityType,
  ApplicationCommandDataResolvable,
  AutocompleteInteraction,
  Client,
  ClientEvents,
  Collection,
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
import { Autocompletion } from "./AutocompletionStructure";
import { ButtonClick } from "./ButtonClick";
import { ModalSubmit } from "./ModalSubmitStructure";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  autocompletions: Collection<string, Autocompletion> = new Collection();
  buttons: Collection<string, ButtonClick> = new Collection();
  modals: Collection<string, ModalSubmit> = new Collection();

  constructor() {
    super({
      intents: ["GuildInvites"],
      allowedMentions: { parse: [] },
      presence: {
        status: "online",
        activities: [
          {
            type: ActivityType.Listening,
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

    // * Autocompletions
    const autocompleFiles = await globPromise(
      `${__dirname}/../autocompletions/*{.ts,.js}`
    );

    autocompleFiles.forEach(async (filePath) => {
      const autocompletion: Autocompletion = await this.importFile(filePath);
      this.autocompletions.set(autocompletion.command, autocompletion);
    });

    // * Buttons
    const buttonFiles = await globPromise(`${__dirname}/../buttons/*{.ts,.js}`);

    buttonFiles.forEach(async (filePath) => {
      const button: ButtonClick = await this.importFile(filePath);
      this.buttons.set(button.id, button);
    });

    // * Modals
    const modalFiles = await globPromise(`${__dirname}/../modals/*{.ts,.js}`);

    modalFiles.forEach(async (filePath) => {
      const modal: ModalSubmit = await this.importFile(filePath);
      this.modals.set(modal.id, modal);
    });
  }
}
