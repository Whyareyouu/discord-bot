const { Events, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { Event } = require("../dbModels.js");
const { sequelize } = require("../dbInit");
const checkPermission = require("../helpers/checkPermission");
const { EVENT_ROLE_IDS } = require("../commands/constants/roleIds");
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const channelId = interaction.channel.id;

    if (channelId !== process.env.CLIENT_EVENT_ROOM_ID) return;

    const message = interaction.message;

    const messageId = message.id;

    const userId = interaction.user.id;

    const event = await Event.findOne({
      where: { messageId },
      raw: true,
    });
    console.log(messageId, event);
    if (!event) {
      return;
    }

    const isUserInEvent = event?.players?.includes(userId);

    const updateMessagePlayersCount = async (updatedPlayers) => {
      const playersCount = Array.isArray(updatedPlayers)
        ? updatedPlayers.length
        : 0;

      const embed = message.embeds[0];
      const editField = embed?.data?.fields.find((f) => f.name === "Игроков");
      editField.value = playersCount;

      await message.edit({
        embeds: [embed],
      });
    };

    if (interaction.customId === "join") {
      if (isUserInEvent) {
        await interaction.reply({
          content: "Вы уже участвуете, нажмите на кнопку, чтобы отменить.",
          ephemeral: true,
        });
        return;
      }
      await Event.update(
        {
          players: sequelize.fn(
            "array_append",
            sequelize.col("players"),
            userId,
          ),
        },
        { where: { id: event.id } },
      );
      const updatedEvent = await Event.findOne({
        where: { id: event.id },
        raw: true,
      });

      await updateMessagePlayersCount(updatedEvent.players);
      await interaction.reply({
        content: "Вы участвуете в событии",
        ephemeral: true,
      });
    }
    if (interaction.customId === "leave") {
      await Event.update(
        {
          players: sequelize.fn(
            "array_remove",
            sequelize.col("players"),
            userId,
          ),
        },
        { where: { id: event.id } },
      );
      const updatedEvent = await Event.findOne({
        where: { id: event.id },
        raw: true,
      });

      await updateMessagePlayersCount(updatedEvent.players);
      await interaction.reply({
        content: "Вы отменили участие в событии.",
        ephemeral: true,
      });
      return;
    }
    if (interaction.customId === "start_event") {
      if (!checkPermission(interaction, EVENT_ROLE_IDS)) {
        await interaction.reply({
          content: "У вас недостаточно прав для использования этой кнопки.",
          ephemeral: true,
        });
        return;
      }
      const eventData = await Event.findOne({
        where: { id: event.id },
        raw: true,
      });
      await eventData?.players?.forEach(
        async (userId) =>
          await message.client.users.send(
            userId,
            `Вы приняли участвие в событии ${eventData.name}`,
          ),
      );
      const updatedButtons = message.components[0].components.map((button) =>
        ButtonBuilder.from(button).setDisabled(true),
      );
      const updatedRow = new ActionRowBuilder().addComponents(updatedButtons);

      await message.edit({
        components: [updatedRow],
      });
      if (interaction.customId === "end_event") {
        if (!checkPermission(interaction, EVENT_ROLE_IDS)) {
          await interaction.reply({
            content: "У вас недостаточно прав для использования этой кнопки.",
            ephemeral: true,
          });
          return;
        }
        const updatedButtons = message.components[0].components.map((button) =>
          ButtonBuilder.from(button).setDisabled(true),
        );
        const updatedRow = new ActionRowBuilder().addComponents(updatedButtons);

        await message.edit({
          components: [updatedRow],
        });
      }
    }
  },
};
