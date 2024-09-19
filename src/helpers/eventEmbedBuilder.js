const { EmbedBuilder } = require("discord.js");
const getEmbedForEvent = (settings) => {
  const embed = new EmbedBuilder()
    .setTitle(`🔔  Ивент — ${settings?.title}`)
    .setDescription("```" + settings?.description + "```")
    .setFields(
      { name: "Игроков", value: "0", inline: true },
      {
        name: "Награда за участие",
        value: "75 🪙",
        inline: true,
      },
    )
    .setImage(settings?.banner)
    .setFooter({ text: settings?.username, iconURL: settings?.avatarURL });

  return embed;
};

module.exports = getEmbedForEvent;
