import {
  formatEmoji,
  hyperlink,
  inlineCode,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { Embed } from "discord.js";
import { minehut } from "../..";
import { addInviteField } from "../../lib/addInviteField";
import { getPlayer } from "../../lib/getPlayer";
import { Command } from "../structures/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("playerlist")
    .setDescription(
      "Get the player list of any minehut server (includes vanished players)."
    )
    .addStringOption((option) =>
      option
        .setName("server")
        .setDescription("The server to grab the player list from.")
        .setRequired(true)
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: false });

    const server = await minehut.servers.get(
      interaction.options.getString("server") || ""
    );

    if (!server) {
      const unknownEmbed = new Embed()
        .setColor("#ffffff")
        .setAuthor({
          name: "Unknown server",
          url: process.env.guildInvite,
          iconURL:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Minecraft_missing_texture_block.svg/425px-Minecraft_missing_texture_block.svg.png?20210630103822",
        })
        .setDescription(
          `${inlineCode(
            interaction.options.getString("server") || ""
          )} is not a real server.`
        )
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: `${interaction.user.avatarURL()}`,
        })
        .setTimestamp();

      if (interaction.guildId !== process.env.guildId)
        await addInviteField(unknownEmbed);

      return await interaction.editReply({ embeds: [unknownEmbed] });
    }

    if (!server.online || !server.players) {
      const offlineEmbed = new Embed()
        .setColor("#ffffff")
        .setTitle(`Server offline   ${formatEmoji("934136685980176435")}`)
        .setDescription(
          `${inlineCode(
            interaction.options.getString("server") || ""
          )} is not online.`
        )
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: `${interaction.user.avatarURL()}`,
        })
        .setTimestamp();

      if (interaction.guildId !== process.env.guildId)
        await addInviteField(offlineEmbed);

      return await interaction.editReply({ embeds: [offlineEmbed] });
    }

    const playerList = await Promise.all(
      server.players?.map(async (uuid) => {
        const player = await getPlayer(uuid);

        return player
          ? hyperlink(
              player.name.replaceAll("_", "\\_"),
              `https://namemc.com/profile/${player.name}`
            )
          : "";
      })
    );

    const playersEmbed = new Embed()
      .setColor("#ffffff")
      .setAuthor({
        name: server.name,
        url: process.env.guildInvite,
      })
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      .setTimestamp();

    if (playerList.length > 0) {
      const chunks: string[][] = [];
      let [lengthHold, currentChunk] = [0, 0];
      for (const player of playerList) {
        if (lengthHold + player.length > 1024) {
          lengthHold = 0;
          currentChunk += 1;
        }

        lengthHold += player.length + 4;
        if (!chunks[currentChunk]) chunks[currentChunk] = [];
        chunks[currentChunk].push(player);
      }

      chunks.forEach((chunk, index) => {
        playersEmbed.addFields({
          name:
            index === 0
              ? `Online players ${inlineCode(`${playerList.length}`)}`
              : "\u200B",
          value:
            index === chunks.length - 1
              ? chunk.join(", ").replace(/, ((?:.(?!, ))+)$/, " and $1")
              : chunk.join(", ") + ",",
          inline: false,
        });
      });
    } else {
      playersEmbed.addFields({
        name: `Online players ${inlineCode(`0`)}`,
        value: "No online players",
        inline: false,
      });
    }

    if (interaction.guildId !== process.env.guildId)
      await addInviteField(playersEmbed);

    await interaction.editReply({ embeds: [playersEmbed] });
  },
});
