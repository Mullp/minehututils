import {
  bold,
  codeBlock,
  Embed,
  formatEmoji,
  hyperlink,
  inlineCode,
  SlashCommandBuilder,
  time,
  underscore,
} from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { minehut } from "../..";
import { addInviteField } from "../../lib/addInviteField";
import { Command } from "../structures/Command";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get info on a server or Minehut.")
    .addSubcommand((subcommand) =>
      subcommand.setName("minehut").setDescription("Get info on Minehut.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("server")
        .setDescription("Get info on a server.")
        .addStringOption((option) =>
          option
            .setName("server")
            .setDescription("The server to get info on.")
            .setRequired(true)
        )
    ),

  run: async ({ interaction }) => {
    switch (interaction.options.getSubcommand()) {
      case "minehut": // TODO: Add minehut stats
        // const embed: MessageEmbed = new MessageEmbed().setTitle("General Minehut info").

        break;

      case "server":
        const server = await minehut.servers.get(
          interaction.options.getString("server") || ""
        );

        if (!server) {
          const embed: MessageEmbed = new MessageEmbed()
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
            );

          if (interaction.guildId !== process.env.guildId)
            await addInviteField(embed);

          return await interaction.editReply({ embeds: [embed] });
        }

        const embed: MessageEmbed = new MessageEmbed()
          .setColor("#ffffff")
          .setTitle(
            `${
              server.suspended
                ? `${formatEmoji("947231107382915103")} ${bold(
                    "SERVER SUSPENDED"
                  )} ${formatEmoji("947231107382915103")}\n`
                : ""
            }${server.name}   ${
              server.online
                ? `${formatEmoji("934136703990513715")}   Online`
                : `${formatEmoji("934136685980176435")}   Offline`
            }`
          )
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: `${interaction.user.avatarURL()}`,
          })
          .setTimestamp();

        embed.setDescription(
          codeBlock(server.motd.replaceAll(/&[a-zA-Z0-9]{1}/gi, ""))
        );

        if (server.categories && server.categories.length > 0)
          embed.addField(
            `${server.categories
              .join(", ")
              .toLocaleLowerCase()
              .replace(/([A-Za-z])\w+/g, (category) => {
                return inlineCode(
                  category.charAt(0).toUpperCase() + category.substring(1)
                );
              })
              .replace(/, ((?:.(?!, ))+)$/, " and $1")}`,
            "\u200B",
            false
          );

        embed.addField(
          "Player count",
          `${inlineCode(
            `${server.playerCount} / ${
              server.maxPlayers
                ? server.maxPlayers
                : server.activeServerPlan === "YEARLY MH Unlimited"
                ? "500"
                : server.activeServerPlan === "MH Unlimited"
                ? "500"
                : server.activeServerPlan === "MH75"
                ? "75"
                : server.activeServerPlan === "MH35"
                ? "35"
                : server.activeServerPlan === "MH20"
                ? "20"
                : server.activeServerPlan === "Daily"
                ? "20"
                : server.activeServerPlan === "Free"
                ? "10"
                : "10"
            }`
          )}${server.online ? `\nRank #${await server.getRank()}` : ""}`,
          true
        );

        embed.addField(
          "Last started",
          "" +
            (server.lastOnline
              ? time(
                  parseInt(Math.floor(server.lastOnline / 1000).toString()),
                  "D"
                ) +
                "\n(" +
                time(
                  parseInt(Math.floor(server.lastOnline / 1000).toString()),
                  "R"
                ) +
                ")"
              : "Server has never been started"),
          true
        );

        embed.addField(
          "Name registration date",
          "" +
            time(
              parseInt(Math.floor(server.createdAt / 1000).toString()),
              "D"
            ) +
            "\n(" +
            time(
              parseInt(Math.floor(server.createdAt / 1000).toString()),
              "R"
            ) +
            ")",
          true
        );

        embed.addField(
          "Server plan",
          `${server.activeServerPlan}\n${underscore(
            (Math.round(server.creditsPerDay * 10) / 10).toString()
          )} credits/day`,
          true
        );

        const icon = await server.getActiveIcon();

        embed.addField(
          "Server icon",
          `${
            icon
              ? `${icon.displayName}\n${underscore(
                  icon.price.toString()
                )} credits`
              : "Sign"
          }`,
          true
        );

        embed.addField("Visibility", server.visibility ? "On" : "Off", true);

        embed.addField("\u200B", "\u200B", false);
        embed.addField(
          `Installed content ${inlineCode(
            `${server.raw.installed_content.length}`
          )}`,
          server.raw.installed_content.length > 0
            ? `${formatEmoji("947247320641208380", true)}`
            : "No content installed",
          false
        );

        if (interaction.guildId !== process.env.guildId)
          await addInviteField(embed);

        await interaction.editReply({ embeds: [embed] });

        const installedContent = (await server.getInstalledContent()).map(
          (content) =>
            `${hyperlink(
              content.title,
              content.details.links[1].linkUrl
                ? content.details.links[1].linkUrl.split(" ")[0]
                : content.details.links[0].linkUrl
                ? content.details.links[0].linkUrl.split(" ")[0]
                : ""
            )}`
        );

        if (installedContent && installedContent.length > 0) {
          if (
            embed.fields.findIndex((field) =>
              field.name.includes("Installed content")
            ) > -1
          )
            embed.fields.splice(
              embed.fields.findIndex((field) =>
                field.name.includes("Installed content")
              ),
              1
            );

          if (
            embed.fields.findIndex((field) =>
              field.value.includes("Join the official support server!")
            ) > -1
          )
            embed.fields.splice(
              embed.fields.findIndex((field) =>
                field.value.includes("Join the official support server!")
              ),
              1
            );

          const chunks: string[][] = [];

          let lengthHold = 0;
          let currentChunk = 0;
          for (const content of installedContent) {
            if (lengthHold + content.length > 1024) {
              lengthHold = 0;
              currentChunk += 1;
            }

            lengthHold += content.length + 4;
            if (!chunks[currentChunk]) chunks[currentChunk] = [];
            chunks[currentChunk].push(content);
          }

          chunks.forEach((chunk, index) => {
            embed.addField(
              index === 0
                ? `Installed content ${inlineCode(
                    `${server.raw.installed_content.length}`
                  )}`
                : "\u200B",
              index === chunks.length - 1
                ? chunk.join(", ").replace(/, ((?:.(?!, ))+)$/, " and $1")
                : chunk.join(", ") + ",",
              false
            );
          });

          if (interaction.guildId !== process.env.guildId)
            await addInviteField(embed);

          await interaction.editReply({ embeds: [embed] });
        }

        break;
      default:
        break;
    }
  },
});
