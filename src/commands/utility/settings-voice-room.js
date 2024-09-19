const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const settingsVoiceButtons = require("../../helpers/settingsVoiceButtons");
const checkPermission = require("../../helpers/checkPermission");
const { ADMIN_ROLE_IDS } = require("../constants/roleIds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings-voice-room")
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
      .setTitle("Управление приватной комнатой")
      .setDescription(
        "Нажимайте на кнопки ниже, чтобы настроить свою комнату. Вы можете использовать управление только при наличии приватного канала.",
      )
      .addFields(
        {
          name: "Управление доступом и участниками",
          value:
            "➕ — `Добавить 1 слот в вашу комнату` \n ➖ — `Убрать 1 слот из комнаты`\n 🔒 — `Разрешить/Запретить вход пользователям`\n 🔐️ — `Изменить видимость комнаты`\n 📤 — `Исключить пользователя из комнаты`",
          inline: true,
        },
        {
          name: "Настройки комнаты",
          value:
            "🔊 — `Забрать/Вернуть возможность говорить` \n ⚙️ — `Изменить битрейт комнаты`\n 🚹 — `Установить количество слотов`\n ✏️ — `Переименовать комнату`\n 🔑 — `Выдать/Забрать доступ к комнате`",
          inline: true,
        },
      );

    const buttons = settingsVoiceButtons();
    await interaction.reply({ embeds: [embed], components: [...buttons] });
  },
};
