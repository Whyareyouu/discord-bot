const {
  Events,
  EmbedBuilder,
  TextInputBuilder,
  ModalBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const { EventList, Event } = require("../dbModels.js");
const { paginate } = require("../helpers/pagination.js");
const getSubmitButtons = require("../helpers/submitButtons.js");
const getEmbedForEvent = require("../helpers/eventEmbedBuilder");
const { ANNOUNCE_EVENT } = require("../commands/constants/buttonsIds");
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId === ANNOUNCE_EVENT) {
      const events = await EventList.findAll({ raw: true });
      const announceEvent = async (eventId, interaction) => {
        const event = await EventList.findOne({
          where: { id: eventId },
          raw: true,
        });

        const embed = new EmbedBuilder().setDescription(
          `Ты хочешь анонсировать ивент ${event.title}?\n На ответ у тебя есть минута`,
        );

        const submitButtons = getSubmitButtons(
          "submit_announce_event",
          "cancel_submit_event",
        );

        const message = await interaction.reply({
          embeds: [embed],
          components: [submitButtons],
          errors: ["time"],
          ephemeral: true,
          fetchReply: true,
        });

        const filter = (i) => i.user.id === interaction.user.id;

        try {
          const confirmation = await message.awaitMessageComponent({
            filter,
            time: 120_000,
          });
          if (confirmation.customId === "submit_announce_event") {
            const modal = new ModalBuilder()
              .setCustomId("event_time_modal")
              .setTitle("Введите время начала ивента");

            const timeInput = new TextInputBuilder()
              .setCustomId("event_time_input")
              .setLabel("Время начала ивента (например, 18:00)")
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(timeInput);

            modal.addComponents(actionRow);

            await confirmation.showModal(modal);

            const submitted = await confirmation.awaitModalSubmit({
              time: 60000,
              filter: (i) => i.user.id === interaction.user.id,
            });

            if (submitted) {
              const startTime =
                submitted.fields.getTextInputValue("event_time_input");
              const channel = confirmation.client.channels.cache.get(
                process.env.CLIENT_EVENT_ROOM_ID,
              );
              const eventEmbed = getEmbedForEvent({
                ...event,
                startTime,
                username: interaction.user.username,
                iconURL: interaction.user.avatarURL(),
              });

              const eventMessage = await channel.send({
                content: "@everyone",
                ...eventEmbed,
              });

              await Event.create({
                name: event.title,
                players: [],
                playerBonus: 75,
                messageId: eventMessage.id,
              });

              await submitted.reply({
                content: "Вы успешно анонсировали ивент",
                embeds: [],
                components: [],
                ephemeral: true,
              });
            }
          } else if (confirmation.customId === "cancel_submit_event") {
            await confirmation.update({
              content: "Нет, так нет.",
              embeds: [],
              components: [],
              ephemeral: true,
            });
          }
        } catch (e) {
          await interaction.update({
            content: "Время вышло",
            embeds: [],
            components: [],
            ephemeral: true,
          });
        }
      };
      await paginate(interaction, events, 60_000, announceEvent);
    }
  },
};
