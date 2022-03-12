import { AutocompleteInteraction } from "discord.js";

export class Autocompletion {
  constructor(
    public command: string,
    public run: (interaction: AutocompleteInteraction) => any
  ) {}
}
