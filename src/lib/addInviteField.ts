import { hyperlink, formatEmoji, italic, bold } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export async function addInviteField(embed: MessageEmbed) {
  return embed.addField(
    "\u200B",
    `${hyperlink(
      `${formatEmoji("946429850825138196")} Join the official support server!`,
      "https://discord.gg/uUejGQ8kGu",
      "Click to join!"
    )}  |  ${hyperlink(
      "Invite me to your own server!",
      "https://discord.com/api/oauth2/authorize?client_id=874273664131010560&permissions=0&scope=bot%20applications.commands",
      "Click to invite the bot!"
    )}`
  );
}
