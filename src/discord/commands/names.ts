import {
  codeBlock,
  inlineCode,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import { minehut } from "../..";
import { addInviteField } from "../../lib/addInviteField";
import { Command } from "../structures/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("names")
    .setDescription("Generate random available server names.")
    .addNumberOption((option) =>
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
    .addNumberOption((option) =>
      option
        .setName("length")
        .setDescription("The exact length of the names.")
        .setRequired(false)
        .setMinValue(4)
        .setMaxValue(10)
    ),

  run: async ({ interaction }) => {
    const amount: number = interaction.options.getNumber("amount") || 10; // TODO: Add mongoDB user rank

    let words: string[] = readFileSync("./src/assets/words/words.txt")
      .toString()
      .replaceAll("\r", "")
      .split("\n");

    if (interaction.options.getString("includes"))
      words = words.filter((word) =>
        word.includes(interaction.options.getString("includes") || "")
      );

    if (interaction.options.getNumber("length"))
      words = words.filter(
        (word) =>
          word.length ===
          Math.floor(interaction.options.getNumber("length") || 6)
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
          if (!(await minehut.servers.get(randomWord))) {
            return randomWord;
          }
        }
      })
    );

    const chunks = [...Array(Math.ceil(names.length / 10))].map((_, i) =>
      names.slice(i * 10, i * 10 + 10)
    );

    const namesEmbed = new MessageEmbed()
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

        namesEmbed.addField(
          index === 0
            ? `${inlineCode(names.length.toString())} available names`
            : "\u200B",
          codeBlock(chunk.filter((word) => word !== undefined).join("\n")),
          true
        );
      }
    } else {
      namesEmbed.addField(
        `${inlineCode("0")} available names`,
        "No avaliable names found with your search query.",
        false
      );
    }

    if (interaction.guildId !== process.env.guildId)
      await addInviteField(namesEmbed);

    interaction.editReply({ embeds: [namesEmbed] });
  },
});
