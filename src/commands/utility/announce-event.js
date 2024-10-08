const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { ANNOUNCE_EVENT } = require("../constants/buttonsIds");
const checkPermission = require("../../helpers/checkPermission");
const { ADMIN_ROLE_IDS } = require("../constants/roleIds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce-event")
    .setDescription("Provides information about the user."),
  async execute(interaction) {
    if (!checkPermission(interaction, ADMIN_ROLE_IDS)) {
      await interaction.reply({
        content: "У вас нет прав для использования этой команды.",
        ephemeral: true,
      });
      return;
    }
    const embed = new EmbedBuilder()
      .setImage("https://media1.tenor.com/m/Bh1zvwlUKWgAAAAC/anime-tyan.gif")
      .setDescription(
        "**С помощью этой консоли вы можете легко объявить новый ивент для всех участников сервера! Просто введите необходимые данные и опубликуйте анонс — система автоматически создаст запись, отправит уведомления и позволит игрокам зарегистрироваться.**",
      );

    const announce_event = new ButtonBuilder()
      .setCustomId(ANNOUNCE_EVENT)
      .setLabel("Анонсировать событие")
      .setStyle(ButtonStyle.Secondary);

    const announceEventActionRow = new ActionRowBuilder().addComponents(
      announce_event,
    );

    await interaction.reply({
      embeds: [embed],
      components: [announceEventActionRow],
    });
  },
};
