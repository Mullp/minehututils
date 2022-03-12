import {
  bold,
  codeBlock,
  formatEmoji,
  hyperlink,
  inlineCode,
  SlashCommandBuilder,
  time,
  underscore,
} from "@discordjs/builders";
import { Embed } from "discord.js";
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
            .setAutocomplete(true)
            .setRequired(true)
        )
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: false });

    switch (interaction.options.getSubcommand()) {
      case "minehut": // TODO: Add minehut stats
        // const servers = (await minehut.getServers())?.servers.sort((a, b) =>
        //   a.playerData.playerCount < b.playerData.playerCount ? 1 : -1
        // );

        const servers = (await minehut.getServers())?.servers.sort((a, b) =>
          a.playerData.playerCount < b.playerData.playerCount ? 1 : -1
        );
        const minehutSimpleStats = await minehut.getSimpleStats();
        const minehutPlayerDistribution = await minehut.getPlayerDistribution();
        const minehutHomepageStats = await minehut.getHomepageStats();

        const minehutEmbed = new Embed()
          .setColor("#ffffff")
          .setTitle("General Minehut information")
          .setAuthor({
            name: "Minehut",
            url: process.env.guildInvite,
            iconURL:
              "https://s3-us-west-1.amazonaws.com/slg-wordpress-images-prod/wp-content/uploads/2019/10/01191153/favicon-5121.png",
          })
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: `${interaction.user.avatarURL()}`,
          })
          .setTimestamp();

        if (servers)
          minehutEmbed.addFields({
            name: `${underscore("Top 5 servers")}`,
            value: `${(
              await Promise.all(
                servers.splice(0, 5).map(async (i) => {
                  const server = await minehut.servers.get(i.name);
                  if (!server) return;

                  return `${bold(server.name)} ${inlineCode(
                    `${server.playerCount} / ${await server.getMaxPlayers()}`
                  )}\nStarted ${time(
                    parseInt(Math.floor(server.lastOnline / 1000).toString()),
                    "R"
                  )}`;
                })
              )
            ).join("\n\n")}`,
            inline: true,
          });

        if (minehutSimpleStats || minehutHomepageStats)
          minehutEmbed.addFields({
            name: `${underscore("Network stats")}`,
            value: `${
              minehutSimpleStats
                ? `${bold("Ram usage")}\n${inlineCode(
                    `${parseInt(minehutSimpleStats.ramCount.toString())}ɢʙ / ${
                      minehutSimpleStats.ramMax
                    }ɢʙ`
                  )}\n\n`
                : ""
            }${
              minehutSimpleStats
                ? `${bold("Player count")}\n${inlineCode(
                    `${minehutSimpleStats.playerCount} / ∞`
                  )}\n\n`
                : ""
            }${
              minehutSimpleStats
                ? `${bold("Servers running")}\n${inlineCode(
                    `${minehutSimpleStats.serverCount} / ${minehutSimpleStats.serverMax}`
                  )}\n\n`
                : ""
            }${
              minehutHomepageStats
                ? `${bold("Total server count")}\n${inlineCode(
                    `${minehutHomepageStats.server_count} / ∞`
                  )}\n\n`
                : ""
            }${
              minehutHomepageStats
                ? `${bold("Total user count")}\n${inlineCode(
                    `${minehutHomepageStats.user_count} / ∞`
                  )}\n\n`
                : ""
            }`,
            inline: true,
          });

        if (minehutPlayerDistribution)
          minehutEmbed.addFields({
            name: `${underscore("Player distribution")}`,
            value: `${bold("Java players")}\nTotal: ${inlineCode(
              minehutPlayerDistribution.java.total.toString()
            )}\nOn servers: ${inlineCode(
              minehutPlayerDistribution.java.playerServer.toString()
            )}\nIn lobby: ${inlineCode(
              minehutPlayerDistribution.java.lobby.toString()
            )}\n\n\n${bold("Bedrock players")}\nTotal: ${inlineCode(
              minehutPlayerDistribution.bedrock.total.toString()
            )}\nOn servers: ${inlineCode(
              minehutPlayerDistribution.bedrock.playerServer.toString()
            )}\nIn lobby: ${inlineCode(
              minehutPlayerDistribution.bedrock.lobby.toString()
            )}`,
            inline: true,
          });

        if (interaction.guildId !== process.env.guildId)
          await addInviteField(minehutEmbed);

        await interaction.editReply({
          embeds: [minehutEmbed],
        });

        break;

      case "server":
        const server = await minehut.servers
          .get(interaction.options.getString("server") || "")
          .catch();

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

        const serverEmbed = new Embed()
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

        serverEmbed.setDescription(
          codeBlock(server.motd.replaceAll(/&[a-zA-Z0-9]{1}/gi, ""))
        );

        if (server.categories && server.categories.length > 0)
          serverEmbed.addFields({
            name: `${server.categories
              .join(", ")
              .toLocaleLowerCase()
              .replace(/([A-Za-z])\w+/g, (category) => {
                return inlineCode(
                  category.charAt(0).toUpperCase() + category.substring(1)
                );
              })
              .replace(/, ((?:.(?!, ))+)$/, " and $1")}`,
            value: "\u200B",
            inline: false,
          });

        serverEmbed.addFields({
          name: "Player count",
          value: `${inlineCode(
            `${server.playerCount} / ${await server.getMaxPlayers()}`
          )}${server.online ? `\nRank #${await server.getRank()}` : ""}`,
          inline: true,
        });

        serverEmbed.addFields({
          name: "Last started",
          value:
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
          inline: true,
        });

        serverEmbed.addFields({
          name: "Name registration date",
          value:
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
          inline: true,
        });

        serverEmbed.addFields({
          name: "Server plan",
          value: `${server.activeServerPlan}\n${underscore(
            (Math.round(server.creditsPerDay * 10) / 10).toString()
          )} credits/day`,
          inline: true,
        });

        const icon = await server.getActiveIcon();

        serverEmbed.addFields({
          name: "Server icon",
          value: `${
            icon
              ? `${icon.displayName}\n${underscore(
                  icon.price.toString()
                )} credits`
              : "Sign"
          }`,
          inline: true,
        });

        if (server.serverProperties)
          serverEmbed.addFields({
            name: "Whitelist",
            value: server.serverProperties["white-list"] ? "On" : "Off",
            inline: true,
          });

        serverEmbed.addFields({
          name: "\u200B",
          value: "\u200B",
          inline: false,
        });
        serverEmbed.addFields({
          name: `Installed content ${inlineCode(
            `${server.raw.installed_content.length}`
          )}`,
          value:
            server.raw.installed_content.length > 0
              ? `${formatEmoji("947247320641208380", true)}`
              : "No content installed",
          inline: false,
        });

        if (interaction.guildId !== process.env.guildId)
          await addInviteField(serverEmbed);

        await interaction.editReply({
          embeds: [serverEmbed],
        });

        const installedContent = (await server.getInstalledContent()).map(
          (content) => {
            const url = content.details.links[1].linkUrl
              ? content.details.links[1].linkUrl.split(" ")[0]
              : content.details.links[0].linkUrl
              ? content.details.links[0].linkUrl.split(" ")[0]
              : "";

            return `${hyperlink(
              url.includes("discord.gg")
                ? `${formatEmoji("950376852642471996")} ${content.title}`
                : content.title,
              url,
              url.includes("discord.gg")
                ? `DISCORD INVITE LINK | ${content.title}`
                : ""
            )}`;
          }
        );

        if (
          installedContent &&
          installedContent.length > 0 &&
          serverEmbed.fields
        ) {
          if (
            serverEmbed.fields.findIndex((field) =>
              field.name.includes("Installed content")
            ) > -1
          )
            serverEmbed.fields.splice(
              serverEmbed.fields.findIndex((field) =>
                field.name.includes("Installed content")
              ),
              1
            );

          if (
            serverEmbed.fields.findIndex((field) =>
              field.value.includes("Join the official support server!")
            ) > -1
          )
            serverEmbed.fields.splice(
              serverEmbed.fields.findIndex((field) =>
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
            serverEmbed.addFields({
              name:
                index === 0
                  ? `Installed content ${inlineCode(
                      `${server.raw.installed_content.length}`
                    )}`
                  : "\u200B",
              value:
                index === chunks.length - 1
                  ? chunk.join(", ").replace(/, ((?:.(?!, ))+)$/, " and $1")
                  : chunk.join(", ") + ",",
              inline: false,
            });
          });

          if (interaction.guildId !== process.env.guildId)
            await addInviteField(serverEmbed);

          await interaction.editReply({ embeds: [serverEmbed] });
        }

        break;
      default:
        break;
    }
  },
});
