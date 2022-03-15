import {
  bold,
  hyperlink,
  inlineCode,
  italic,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { Embed } from "discord.js";
import { minehut } from "../..";
import { addInviteField } from "../../lib/addInviteField";
import { getPlayer } from "../../lib/getPlayer";
import { idToUuid } from "../../lib/idToUuid";
import { Command } from "../structures/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("find")
    .setDescription("Find any online player.")
    .addStringOption((option) =>
      option
        .setName("player")
        .setDescription("The player to find.")
        .setRequired(true)
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: false });

    const player = await getPlayer(
      interaction.options.getString("player") || ""
    );

    if (!player) {
      const embed = new Embed()
        .setColor("#ffffff")
        .setAuthor({
          name: "Unknown player",
          url: process.env.guildInvite,
          iconURL:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Minecraft_missing_texture_block.svg/425px-Minecraft_missing_texture_block.svg.png?20210630103822",
        })
        .setDescription(
          `${inlineCode(
            interaction.options.getString("player") || ""
          )} is not a real player.`
        );

      if (interaction.guildId !== process.env.guildId)
        await addInviteField(embed);

      return await interaction.editReply({ embeds: [embed] });
    }

    const serverOn = await minehut.players.find(idToUuid(player.id) || "");

    const embed = new Embed()
      .setColor("#ffffff")
      .setAuthor({
        name: player.name,
        url: `https://discord.gg/uUejGQ8kGu`,
        iconURL: `https://mc-heads.net/avatar/${player.id}`,
      })
      .setThumbnail(`https://mc-heads.net/body/${player.id}`)
      .addFields(
        {
          name: `Status   ${
            serverOn && serverOn.length > 0
              ? `<:right:934136703990513715>`
              : `<:wrong:934136685980176435>`
          }`,
          value:
            serverOn && serverOn.length > 0 && serverOn[0]
              ? `${hyperlink(
                  player.name,
                  `https://namemc.com/profile/${player.name}`
                )} is currently on ${bold(
                  `${inlineCode(serverOn[0].name)}`
                )}.\n${italic(
                  `Get server info ${inlineCode(
                    `/info server ${serverOn[0].name}`
                  )}.`
                )}` // TODO: Add "joined x time ago"
              : `${hyperlink(
                  player.name,
                  `https://namemc.com/profile/${player.name}`
                )} is currently not on any server.`,
        }
        // { // TODO: Add
        //   name: "History",
        //   value: `${underscore("PlayInABox")}\n${time(
        //     1642776659,
        //     "T"
        //   )} - ${time(1642775659, "T")}`,
        //   inline: true,
        // }
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      .setTimestamp();

    if (interaction.guildId !== process.env.guildId)
      await addInviteField(embed);

    await interaction.editReply({
      embeds: [embed],
    });
  },
});
