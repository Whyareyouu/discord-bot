const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { Events } = require("../../dbModels.js");
const { sequelize } = require("../../dbInit.js");
const checkPermission = require("../../helpers/checkPermission");
const { EVENT_ROLE_IDS } = require("../constants/roleIds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Provides information about the user."),
  async execute(interaction) {
    if (!checkPermission(interaction, EVENT_ROLE_IDS)) {
      await interaction.reply({
        content: "У вас нет прав для использования этой команды.",
        ephemeral: true,
      });
      return;
    }
    const embed = new EmbedBuilder()
      .setTitle("🔔  Ивент — Goose goose duck!")
      .setDescription(
        "```Goose Goose Duck — социальная игра, основанная на применении дедукции, в которой группа игроков в образе гусей работает сообща, пытаясь выполнить все цели миссии. Задача осложняется тем, что в команде есть предатели — утки и прочие птицы, каждая из которых отыгрывает свою роль```",
      )
      .setFields(
        { name: "Игроков", value: "0", inline: true },
        {
          name: "Награда за участие",
          value: "75 🪙",
          inline: true,
        },
      )
      .setImage(
        "https://media1.tenor.com/m/6jzIXECrncsAAAAC/goosegooseduck-ggd.gif",
      )
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      });

    const event = await Events.create({
      name: "Goose Goose Duck",
      players: [],
      playerBonus: 75,
    });

    const join_event = new ButtonBuilder()
      .setCustomId("join")
      .setLabel("Участвую!")
      .setStyle(ButtonStyle.Success);

    const joinActionRow = new ActionRowBuilder().addComponents(join_event);

    const message = await interaction.reply({
      embeds: [embed],
      components: [joinActionRow],
    });

    const collectorFilter = (i) => !i.user.bot;
    const collector = message.createMessageComponentCollector({
      filter: collectorFilter,
      time: 10_000,
    });
    collector.on("collect", async (confirmation) => {
      const userId = confirmation.user.id;
      if (confirmation.customId === "join") {
        await Events.update(
          {
            players: sequelize.fn(
              "array_append",
              sequelize.col("players"),
              userId,
            ),
          },
          { where: { id: event.id } },
        );
        const playersCount = await Events.findByPk(event.id).then(
          (event) => event?.dataValues?.players?.length,
        );
        const editField = embed?.data?.fields.find((f) => f.name === "Игроков");
        editField.value = playersCount;

        const leave_event = new ButtonBuilder()
          .setCustomId("leave")
          .setLabel("Отмена")
          .setStyle(ButtonStyle.Danger);

        const leaveActionRow = new ActionRowBuilder().addComponents(
          leave_event,
        );

        await message.edit({ embeds: [embed], components: [leaveActionRow] });

        await confirmation.deferUpdate();
      } else if (confirmation.customId === "leave") {
        await Events.update(
          {
            players: sequelize.fn(
              "array_remove",
              sequelize.col("players"),
              userId,
            ),
          },
          { where: { id: event.id } },
        );

        const playersCount = await Events.findByPk(event.id).then(
          (event) => event?.dataValues?.players?.length,
        );
        const editField = embed?.data?.fields.find((f) => f.name === "Игроков");
        editField.value = playersCount;

        await message.edit({ embeds: [embed], components: [joinActionRow] });

        await confirmation.deferUpdate();
      }
    });

    collector.on("end", async () => {
      console.log("Time is out");
      const endEvent = new ButtonBuilder()
        .setCustomId("end")
        .setLabel("Регистрация закончена")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

      const endActionRow = new ActionRowBuilder().addComponents(endEvent);

      await message.edit({ embeds: [embed], components: [endActionRow] });

      const acceptedUsers = await Events.findByPk(event.id);

      acceptedUsers?.dataValues?.players?.forEach(
        async (userId) =>
          await message.client.users.send(
            userId,
            "Вы приняли участвие в событии",
          ),
      );
    });
  },
};
