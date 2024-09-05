const {ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const getSubmitButtons = (acceptId, cancelId) => {
    const acceptCreateEvent = new ButtonBuilder()
        .setCustomId(acceptId)
        .setLabel('✅')
        .setStyle(ButtonStyle.Success);

    const cancelCreateEvent = new ButtonBuilder()
        .setCustomId(cancelId)
        .setLabel('⛔')
        .setStyle(ButtonStyle.Danger);

    const announceEventActionRow = new ActionRowBuilder()
        .addComponents(acceptCreateEvent, cancelCreateEvent);

    return announceEventActionRow;
}


module.exports = getSubmitButtons