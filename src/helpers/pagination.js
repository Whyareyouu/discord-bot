const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");

async function paginate(interaction, elements, timeout = 60_000, callback) {
  if (!elements.length) {
    interaction.reply({ content: "Нет доступных событий", ephemeral: true });
    return;
  }

  const elementsPerPage = 5;
  const totalPages = Math.ceil(elements.length / elementsPerPage);
  let currentPage = 0;

  const generateEmbed = (page) => {
    const start = page * elementsPerPage;
    const end = Math.min(start + elementsPerPage, elements.length);

    const description = elements
      .slice(start, end)
      .map(
        (element, index) =>
          `${start + index + 1}. **${element.title}**\n${element.description}`,
      )
      .join("\n\n");

    return new EmbedBuilder()
      .setTitle(`Список доступных событий. Страница ${page + 1}`)
      .setDescription(description)
      .setColor(0x00ff00);
  };

  const generateButtons = (page) => {
    const start = page * elementsPerPage;
    const end = Math.min(start + elementsPerPage, elements.length);
    const buttons = [];
    const ids = elements.map(({ id }) => id).slice(start, end);
    for (let i = 0; i < ids.length; i++) {
      const labelNumber = ids[i];

      buttons.push(
        new ButtonBuilder()
          .setCustomId(`item_${labelNumber}`)
          .setLabel(`${i + 1}`)
          .setStyle(ButtonStyle.Primary),
      );
    }

    return new ActionRowBuilder().addComponents(buttons);
  };

  const embed = generateEmbed(currentPage);
  const buttons = generateButtons(currentPage);

  const prevPageButton = new ButtonBuilder()
    .setCustomId("prev_page")
    .setLabel("⏪")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(currentPage === 0);

  const nextPageButton = new ButtonBuilder()
    .setCustomId("next_page")
    .setLabel("⏩")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(currentPage === totalPages - 1);

  const navigationRow = new ActionRowBuilder().addComponents(
    prevPageButton,
    nextPageButton,
  );

  const message = await interaction.reply({
    embeds: [embed],
    components: [buttons, navigationRow],
    ephemeral: true,
    fetchReply: true,
  });
  const filter = (i) => {
    return (
      i.customId.startsWith("item_") ||
      ((i.customId === "prev_page" || i.customId === "next_page") &&
        i.user.id === interaction.user.id)
    );
  };
  const collector = message.createMessageComponentCollector({
    filter,
    time: timeout,
  });

  collector.on("collect", async (confirmation) => {
    try {
      if (confirmation.customId === "prev_page" && currentPage > 0) {
        currentPage--;
      } else if (
        confirmation.customId === "next_page" &&
        currentPage < totalPages - 1
      ) {
        currentPage++;
      } else if (confirmation.customId.startsWith("item_")) {
        const itemNumber = confirmation.customId.split("_")[1];
        await callback(itemNumber, confirmation);
        return;
      }

      const updatedEmbed = generateEmbed(currentPage);
      const updatedButtons = generateButtons(currentPage);

      prevPageButton.setDisabled(currentPage === 0);
      nextPageButton.setDisabled(currentPage === totalPages - 1);

      await confirmation.update({
        embeds: [updatedEmbed],
        components: [updatedButtons, navigationRow],
      });
    } catch (error) {
      console.error("Ошибка при обработке кнопки:", error);
    }
  });
  // TODO: Stop collector when message close
  collector.on("end", async (confirmation) => {
    // const disabledRow = new ActionRowBuilder().addComponents(
    //     prevPageButton.setDisabled(true),
    //     nextPageButton.setDisabled(true)
    // );

    await interaction.followUp({ content: "Время вышло", ephemeral: true });
  });
}

module.exports = { paginate };
