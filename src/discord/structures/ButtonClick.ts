import { ButtonInteraction } from "discord.js";

export class ButtonClick {
  constructor(
    public id: string,
    public run: (interaction: ButtonInteraction) => any
  ) {}
}
