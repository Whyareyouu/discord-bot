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
    .setFooter({ text: settings?.username, iconURL: settings?.iconURL });

  const join_event = new ButtonBuilder()
    .setCustomId("join")
    .setLabel("Присоединиться")
    .setStyle(ButtonStyle.Success);
  const leave_event = new ButtonBuilder()
    .setCustomId("leave")
    .setLabel("Отменить участие")
    .setStyle(ButtonStyle.Danger);

  const show_player = new ButtonBuilder()
    .setCustomId("show_event_players")
    .setLabel("Показать участников")
    .setStyle(ButtonStyle.Secondary);

  const startEvent = new ButtonBuilder()
    .setCustomId("start_event")
    .setLabel("Запустить ивент")
    .setStyle(ButtonStyle.Primary);
  const endEvent = new ButtonBuilder()
    .setCustomId("end_event")
    .setLabel("Завершить ивент")
    .setStyle(ButtonStyle.Secondary);

  const joinActionRow = new ActionRowBuilder().addComponents(
    join_event,
    leave_event,
    show_player,
  );

  const controlEvent = new ActionRowBuilder().addComponents(
    startEvent,
    endEvent,
  );

  return {
    embeds: [embed],
    components: [joinActionRow, controlEvent],
    fetchReply: true,
  };
};

module.exports = getEmbedForEvent;
