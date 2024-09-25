const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");
const { EventList } = require("../../dbModels.js");
const {
  CONFIRM_CREATE_EVENT_BUTTON,
  CANCEL_CREATE_EVENT_BUTTON,
} = require("../constants/buttonsIds");
const { EVENT_ROLE_IDS } = require("../constants/roleIds");
const checkPermission = require("../../helpers/checkPermission");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-event")
    .setDescription("Создать ивент")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Название ивента для отображения в заголовке")
        .setRequired(true)
        .setMaxLength(255),
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Описание ивента")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("banner")
        .setDescription(
          "Ссылка на изображение или гифку для отображения в ивенте",
        )
        .setRequired(true)
        .setMaxLength(255),
    ),

  async execute(interaction) {
    if (!checkPermission(interaction, EVENT_ROLE_IDS)) {
      await interaction.reply({
        content: "У вас нет прав для использования этой команды.",
        ephemeral: true,
      });
      return;
    }

    const options = interaction.options?._hoistedOptions;

    const confirmCreateEventButton = new ButtonBuilder()
      .setCustomId(CONFIRM_CREATE_EVENT_BUTTON)
      .setLabel("✅")
      .setStyle(ButtonStyle.Success);

    const cancelCreateEventButton = new ButtonBuilder()
      .setCustomId(CANCEL_CREATE_EVENT_BUTTON)
      .setLabel("⛔")
      .setStyle(ButtonStyle.Danger);

    const announceEventActionRow = new ActionRowBuilder().addComponents(
      confirmCreateEventButton,
      cancelCreateEventButton,
    );

    if (!options) {
      await interaction.reply({
        content: "Произошла ошибка при создании ивента",
        ephemeral: true,
      });
      return;
    }
    try {
      // @TODO: transfer this function in helpers
      const transformedOptions = options?.reduce(
        (acc, option) => ({ ...acc, [option.name]: option.value }),
        {},
      );
      const embed = new EmbedBuilder()
        .setTitle(`🔔  Ивент — ${transformedOptions?.title}`)
        .setDescription("```" + transformedOptions?.description + "```")
        .setFields(
          { name: "Количество игроков", value: "0", inline: true },
          {
            name: "Награда за участие",
            value: "75 🪙",
            inline: true,
          },
        )
        .setImage(transformedOptions.banner);

      const message = await interaction.reply({
        content: "Пример создаваемого ивента",
        embeds: [embed],
        components: [announceEventActionRow],
        ephemeral: true,
      });
      const filter = (i) => i.user.id === interaction.user.id;
      try {
        const confirmation = await message.awaitMessageComponent({
          filter,
          time: 60000,
        });
        if (confirmation.customId === CONFIRM_CREATE_EVENT_BUTTON) {
          await EventList.create(transformedOptions);
          await confirmation.reply({
            content: "Ивент успешно создан!",
            embeds: [embed],
            components: [],
            ephemeral: false,
          });
        } else if (confirmation.customId === CANCEL_CREATE_EVENT_BUTTON) {
          await confirmation.update({
            content: "Создание ивента было отменено.",
            embeds: [],
            components: [],
            ephemeral: true,
          });
        }
      } catch (e) {
        if (e?.name === "SequelizeUniqueConstraintError") {
          await interaction.followUp({
            content: `Ошибка при обработке запроса: ${e.parent?.detail}. Попробуйте снова.`,
            ephemeral: true,
          });
          return;
        }
        await interaction.followUp({
          content: `Произошла ошибка при обработке вашего запроса. Попробуйте снова.`,
          ephemeral: true,
        });
      }
    } catch (e) {
      console.log(e);
      await interaction.followUp({
        content: "Произошла ошибка при создании ивента. Попробуйте снова.",
        ephemeral: true,
      });
    }
  },
};
