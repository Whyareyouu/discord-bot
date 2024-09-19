const {
  Events,
  EmbedBuilder,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const { UserRooms, Users } = require("../dbModels");
const {
  ADD_USER_SLOT,
  REMOVE_USER_SLOT,
  TOGGLE_ROOM_VISIBILITY,
  LOCK_ROOM,
  KICK_USER,
  TOGGLE_MUTE_USER,
  ADJUST_BITRATE,
  SET_ROOM_SLOTS,
  RENAME_ROOM,
  TOGGLE_USER_ACCESS,
} = require("../commands/constants/buttonsIds");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (
      !interaction.isButton() &&
      !interaction.isModalSubmit() &&
      !interaction.isSelectMenu()
    )
      return;

    const errorEmbed = new EmbedBuilder()
      .setTitle("Приватные комнаты")
      .setDescription("Не удалось найти твой канал!");

    const userId = interaction.member.user.id;

    const userRoom = await UserRooms.findOne({ where: { userId }, raw: true });
    const voiceChannel = interaction.guild.channels.cache.get(userRoom?.roomId);

    if (!userRoom || !voiceChannel) {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      return;
    }

    const everyoneRole = interaction.guild.roles.everyone;
    const members = voiceChannel.members;

    const maxBitrate = 96000;
    const minBitrate = 8000;

    switch (interaction.customId) {
      case ADD_USER_SLOT:
        if (voiceChannel.userLimit === 25) {
          await interaction.reply({
            content: "Максимум слотов достигнут.",
            ephemeral: true,
          });
          return;
        }
        await voiceChannel.setUserLimit(voiceChannel.userLimit + 1);
        await interaction.reply({
          content: "Добавлен 1 слот.",
          ephemeral: true,
        });
        break;

      case REMOVE_USER_SLOT:
        if (voiceChannel.userLimit === 1) {
          await interaction.reply({
            content: "Минимум слотов достигнут.",
            ephemeral: true,
          });
          return;
        }
        await voiceChannel.setUserLimit(voiceChannel.userLimit - 1);
        await interaction.reply({ content: "Убран 1 слот.", ephemeral: true });
        break;

      case LOCK_ROOM:
        const permissions = voiceChannel
          .permissionsFor(everyoneRole)
          .has(PermissionsBitField.Flags.Connect);

        await voiceChannel.permissionOverwrites.edit(everyoneRole, {
          Connect: !permissions,
        });

        await interaction.reply({
          content: `Теперь доступ к каналу ${permissions ? "запрещён" : "разрешён"}.`,
          ephemeral: true,
        });
        break;

      case TOGGLE_ROOM_VISIBILITY:
        const viewPermissions = voiceChannel
          .permissionsFor(everyoneRole)
          .has(PermissionsBitField.Flags.ViewChannel);

        await voiceChannel.permissionOverwrites.edit(everyoneRole, {
          ViewChannel: !viewPermissions,
        });

        await interaction.reply({
          content: `Теперь комната ${viewPermissions ? "невидима" : "видима"}.`,
          ephemeral: true,
        });
        break;

      case KICK_USER:
      case TOGGLE_MUTE_USER:
        const userOptions = members.map((member) => ({
          label: member.user.tag,
          value: member.user.id,
        }));

        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId(`user_select_${interaction.customId}`)
          .setPlaceholder("Выберите пользователя")
          .addOptions(userOptions);

        const selectRow = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
          content: "Выберите пользователя из списка:",
          components: [selectRow],
          ephemeral: true,
        });
        break;
      case ADJUST_BITRATE: {
        const bitrateModal = new ModalBuilder()
          .setCustomId("bitrate_modal")
          .setTitle("Изменение битрейта комнаты");

        const bitrateInput = new TextInputBuilder()
          .setCustomId("bitrate_input")
          .setLabel(
            `Введите битрейт (от ${minBitrate / 1000} до ${maxBitrate / 1000} kbps)`,
          )
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(2)
          .setMinLength(1)
          .setPlaceholder(`${voiceChannel.bitrate / 1000}`); // Показывает текущий битрейт

        const bitrateActionRow = new ActionRowBuilder().addComponents(
          bitrateInput,
        );

        bitrateModal.addComponents(bitrateActionRow);

        await interaction.showModal(bitrateModal);
        break;
      }

      case SET_ROOM_SLOTS:
        const roomSlotsModal = new ModalBuilder()
          .setCustomId("set_room_slots_modal")
          .setTitle("Укажите количество слотов");

        const slotsInput = new TextInputBuilder()
          .setCustomId("room_slots_input")
          .setLabel("Количество слотов (1-99)")
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(2)
          .setPlaceholder("Введите число от 1 до 99")
          .setRequired(true);

        const roomSlotsActionRow = new ActionRowBuilder().addComponents(
          slotsInput,
        );

        roomSlotsModal.addComponents(roomSlotsActionRow);

        await interaction.showModal(roomSlotsModal);
        break;
      case RENAME_ROOM:
        const renameRoomModal = new ModalBuilder()
          .setCustomId("rename_room_modal")
          .setTitle("Укажите новое название комнаты");

        const renameRoomInput = new TextInputBuilder()
          .setCustomId("room_rename_input")
          .setLabel("Новое название комнаты")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(100)
          .setRequired(true);

        const renameRoomActionRow = new ActionRowBuilder().addComponents(
          renameRoomInput,
        );

        renameRoomModal.addComponents(renameRoomActionRow);

        await interaction.showModal(renameRoomModal);
        break;
      case TOGGLE_USER_ACCESS:
        const accessModal = new ModalBuilder()
          .setCustomId("user_access_modal")
          .setTitle("Введите tag пользователя");

        const accessInput = new TextInputBuilder()
          .setCustomId("user_access_input")
          .setLabel("Tag пользователя (username#0000)")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const accessActionRow = new ActionRowBuilder().addComponents(
          accessInput,
        );

        accessModal.addComponents(accessActionRow);

        await interaction.showModal(accessModal);
        break;

      default:
        break;
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId === "set_room_slots_modal"
    ) {
      const slots = interaction.fields.getTextInputValue("room_slots_input");

      const slotNumber = parseInt(slots, 10);
      if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 99) {
        await interaction.reply({
          content: "Недопустимое количество слотов. Укажите число от 1 до 99.",
          ephemeral: true,
        });
        return;
      }

      await voiceChannel.setUserLimit(slotNumber);
      await interaction.reply({
        content: `Количество слотов изменено на ${slotNumber}.`,
        ephemeral: true,
      });
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId === "rename_room_modal"
    ) {
      const newRoomName =
        interaction.fields.getTextInputValue("room_rename_input");

      if (!newRoomName || newRoomName.length > 100) {
        await interaction.reply({
          content:
            "Недопустимое имя. Убедитесь, что оно не превышает 100 символов.",
          ephemeral: true,
        });
        return;
      }

      await voiceChannel.setName(newRoomName);
      await interaction.reply({
        content: `Комната успешно переименована в "${newRoomName}".`,
        ephemeral: true,
      });
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId === "bitrate_modal"
    ) {
      const newBitrateValue =
        interaction.fields.getTextInputValue("bitrate_input");

      const newBitrate = parseInt(newBitrateValue) * 1000;

      if (
        isNaN(newBitrate) ||
        newBitrate < minBitrate ||
        newBitrate > maxBitrate
      ) {
        await interaction.reply({
          content: `Недопустимый битрейт. Укажите значение от ${minBitrate / 1000} до ${maxBitrate / 1000} kbps.`,
          ephemeral: true,
        });
        return;
      }

      await voiceChannel.setBitrate(newBitrate);
      await interaction.reply({
        content: `Битрейт комнаты изменён на ${newBitrate / 1000} kbps.`,
        ephemeral: true,
      });
    }
    if (
      interaction.isModalSubmit() &&
      interaction.customId === "user_access_modal"
    ) {
      const userTag = interaction.fields.getTextInputValue("user_access_input");

      try {
        const targetUser = await Users.findOne({
          where: { userTag },
          raw: true,
        });

        if (!targetUser) {
          await interaction.reply({
            content: `Пользователь с тегом ${userTag} не найден.`,
            ephemeral: true,
          });
          return;
        }

        const checkPermission = voiceChannel
          .permissionsFor(targetUser.userId)
          .has(PermissionsBitField.Flags.Connect);
        await voiceChannel.permissionOverwrites.edit(targetUser.userId, {
          Connect: !checkPermission,
          ViewChannel: !checkPermission,
        });

        await interaction.reply({
          content: `Права доступа для ${targetUser.userTag} ${checkPermission ? "забраны" : "выданы"}.`,
          ephemeral: true,
        });
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: "Ошибка при изменении прав доступа.",
          ephemeral: true,
        });
      }
    }
    if (
      interaction.isSelectMenu() &&
      interaction.customId.startsWith("user_select_")
    ) {
      console.log("select was userd");
      const targetUserId = interaction.values[0];
      const targetMember = await interaction.guild.members.fetch(targetUserId);
      const action = interaction.customId.replace("user_select_", "");

      switch (action) {
        case KICK_USER:
          await targetMember.voice.disconnect("Вас исключили из комнаты.");
          await interaction.update({
            content: `Пользователь ${targetMember.user.tag} исключён из комнаты.`,
            components: [],
          });
          break;

        case TOGGLE_MUTE_USER:
          const currentSpeakPermission = voiceChannel
            .permissionsFor(targetUserId)
            .has(PermissionsBitField.Flags.Speak);
          await voiceChannel.permissionOverwrites.edit(targetUserId, {
            Speak: !currentSpeakPermission,
          });
          await interaction.update({
            content: `У пользователя ${targetMember.user.tag} теперь ${currentSpeakPermission ? "нет" : "есть"} права говорить.`,
            components: [],
          });
          break;
      }
    }
  },
};
