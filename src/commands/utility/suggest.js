const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Provides information about the user.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setImage('https://www.thisiscolossal.com/wp-content/uploads/2018/04/agif1opt.gif')
            .setFooter({text: "Вы можете предложить ведущим свой ивент"})

        const suggest_event = new ButtonBuilder()
            .setCustomId('suggest_event')
            .setLabel('Заказать ивент')
            .setStyle(ButtonStyle.Primary);

        const suggestEventActionRow = new ActionRowBuilder()
            .addComponents(suggest_event);

        await interaction.reply({embeds: [embed], components: [suggestEventActionRow]});

    },


};