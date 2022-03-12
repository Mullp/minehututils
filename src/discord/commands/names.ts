import {
  codeBlock,
  inlineCode,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { Embed } from "discord.js";
import { readFileSync } from "fs";
import { minehut } from "../..";
import { addInviteField } from "../../lib/addInviteField";
import { Command } from "../structures/Command";

const allWords: string[] = readFileSync("./assets/words/words.txt")
  .toString()
  .replaceAll("\r", "")
  .split("\n");

export default new Command({
  data: new SlashCommandBuilder()
    .setName("names")
    .setDescription("Generate random available server names.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of names to generate.")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(20)
    )
    .addStringOption((option) =>
      option
        .setName("includes")
        .setDescription("The phrase the names must inclue.")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("length")
        .setDescription("The exact length of the names.")
        .setRequired(false)
        .setMinValue(4)
        .setMaxValue(10)
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: false });

    const amount: number = interaction.options.getInteger("amount") || 10; // TODO: Add mongoDB user rank

    let words: string[] = allWords;

    if (interaction.options.getString("includes"))
      words = words.filter((word) =>
        word.includes(interaction.options.getString("includes") || "")
      );

    if (interaction.options.getInteger("length"))
      words = words.filter(
        (word) => word.length === interaction.options.getInteger("length") || 6
      );

    const checkedNames: string[] = [];
    const names = await Promise.all(
      [...Array(amount)].map(async () => {
        while (true) {
          if (words.length <= checkedNames.length) break;

          const randomWord =
            words[Math.floor(Math.random() * words.length)].toLowerCase();

          if (checkedNames.includes(randomWord)) continue;
          checkedNames.push(randomWord);

          if (!(await minehut.servers.get(randomWord))) return randomWord;
        }
      })
    );

    const chunks = [...Array(Math.ceil(names.length / 10))].map((_, i) =>
      names.slice(i * 10, i * 10 + 10)
    );

    const namesEmbed = new Embed()
      .setColor("#ffffff")
      .setAuthor({
        name: "Random names",
        url: process.env.guildInvite,
      })
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      .setTimestamp();

    if (names.filter((word) => word !== undefined).length !== 0) {
      for (const [index, chunk] of chunks.entries()) {
        if (!(chunk.filter((word) => word !== undefined).length > 0)) continue;

        namesEmbed.addFields({
          name:
            index === 0
              ? `${inlineCode(
                  names.filter((word) => word !== undefined).length.toString()
                )} available names`
              : "\u200B",
          value: codeBlock(
            chunk.filter((word) => word !== undefined).join("\n")
          ),
          inline: true,
        });
      }
    } else {
      namesEmbed.addFields({
        name: `${inlineCode("0")} available names`,
        value: "No avaliable names found with your search query.",
        inline: false,
      });
    }

    if (interaction.guildId !== process.env.guildId)
      await addInviteField(namesEmbed);

    interaction.editReply({ embeds: [namesEmbed] });
  },
});
