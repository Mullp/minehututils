import { ModalSubmitInteraction } from "discord.js";

export class ModalSubmit {
  constructor(
    public id: string,
    public run: (interaction: ModalSubmitInteraction) => any
  ) {}
}
