const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require("discord.js");
const getSuggestModal = async () => {
  const modal = new ModalBuilder()
    .setCustomId("suggest_event_modal")
    .setTitle("Заказ ивента");

  const suggestedEventInput = new TextInputBuilder()
    .setCustomId("suggestedEventInput")
    .setLabel("Укажите желаемый ивент")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(3);

  const modalActionRow = new ActionRowBuilder().addComponents(
    suggestedEventInput,
  );

  modal.addComponents(modalActionRow);

  return modal;
};

const getSuggestEmbed = (username, avatarUrl, eventName) => {
  const embed = new EmbedBuilder()
    .setTitle(`🔔 Предложение ивента — ${eventName}`)
    .setFooter({ text: username, iconURL: avatarUrl });

  return embed;
};

module.exports = { getSuggestModal, getSuggestEmbed };
