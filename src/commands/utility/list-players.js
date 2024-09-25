const { SlashCommandBuilder } = require("discord.js");
const { Event } = require("../../dbModels.js");
const checkPermission = require("../../helpers/checkPermission");
const { EVENT_ROLE_IDS } = require("../constants/roleIds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-players")
    .addStringOption((option) =>
      option
        .setName("messageid")
        .setDescription("Id сообщения отправленного ивента")
        .setRequired(true)
        .setMaxLength(255),
    )
    .setDescription("Выводит список участников события"),

  async execute(interaction) {
    if (!checkPermission(interaction, EVENT_ROLE_IDS)) {
      await interaction.reply({
        content: "У вас нет прав для использования этой команды.",
        ephemeral: true,
      });
      return;
    }
    const options = interaction.options?._hoistedOptions;

    if (!options) {
      await interaction.reply({
        content: "Произошла ошибка при создании ивента",
        ephemeral: true,
      });
      return;
    }
    const transformedOptions = options?.reduce(
      (acc, option) => ({ ...acc, [option.name]: option.value }),
      {},
    );
    try {
      const event = await Event.findOne({
        where: { messageId: transformedOptions?.messageid },
        raw: true,
      });
      const memberPromises = event?.players.map((id) =>
        interaction.guild.members.fetch(id),
      );
      const members = await Promise.all(memberPromises);

      const memberNames = members.map((member) => member?.nickname).join("\n");

      await interaction.reply({
        content: `Список участников:\n${memberNames}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Ошибка получения участников:", error);
      await interaction.reply({
        content: "Произошла ошибка при получении участников.",
        ephemeral: true,
      });
    }
  },
};
