const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const getEmbedForEvent = (settings) => {
  const embed = new EmbedBuilder()
    .setTitle(`🔔  Ивент — ${settings?.title}`)
    .setDescription("```" + settings?.description + "```")
    .setFields(
      { name: "Время начала", value: settings?.startTime, inline: true },
      { name: "Игроков", value: "0", inline: true },
      {
        name: "Награда за участие",
        value: "75 🪙",
        inline: true,
      },
    )
    .setImage(settings?.banner)
    .setFooter({ text: settings?.username, iconURL: settings?.avatarURL });

  const join_event = new ButtonBuilder()
    .setCustomId("join")
    .setLabel("Участвую!")
    .setStyle(ButtonStyle.Success);
  const leave_event = new ButtonBuilder()
    .setCustomId("leave")
    .setLabel("Отмена")
    .setStyle(ButtonStyle.Danger);

  const startEvent = new ButtonBuilder()
    .setCustomId("start_event")
    .setLabel("Начать")
    .setStyle(ButtonStyle.Primary);

  const joinActionRow = new ActionRowBuilder().addComponents(
    join_event,
    leave_event,
  );

  const controlEvent = new ActionRowBuilder().addComponents(startEvent);

  return {
    embeds: [embed],
    components: [joinActionRow, controlEvent],
    fetchReply: true,
  };
};

module.exports = getEmbedForEvent;
