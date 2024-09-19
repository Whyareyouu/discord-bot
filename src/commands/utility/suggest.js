const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const checkPermission = require("../../helpers/checkPermission");
const { ADMIN_ROLE_IDS } = require("../constants/roleIds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
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
      .setImage(
        "https://www.thisiscolossal.com/wp-content/uploads/2018/04/agif1opt.gif",
      )
      .setFooter({ text: "Вы можете предложить ведущим свой ивент" });

    const suggest_event = new ButtonBuilder()
      .setCustomId("suggest_event")
      .setLabel("Заказать ивент")
      .setStyle(ButtonStyle.Primary);

    const suggestEventActionRow = new ActionRowBuilder().addComponents(
      suggest_event,
    );

    await interaction.reply({
      embeds: [embed],
      components: [suggestEventActionRow],
    });
  },
};
