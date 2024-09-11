const { ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");

const settingsVoiceButtons = () => {
    const addUserSlotButton = new ButtonBuilder()
        .setCustomId('addUserSlot')
        .setLabel("➕")
        .setStyle(ButtonStyle.Secondary);

    const removeUserSlotButton = new ButtonBuilder()
        .setCustomId('removeUserSlot')
        .setLabel("➖")
        .setStyle(ButtonStyle.Secondary);

    const lockRoomButton = new ButtonBuilder()
        .setCustomId('lockRoom')
        .setLabel("🔒")
        .setStyle(ButtonStyle.Secondary);

    const toggleMuteUserButton = new ButtonBuilder()
        .setCustomId('toggleMuteUser')
        .setLabel("🔊")
        .setStyle(ButtonStyle.Secondary);

    const kickUserButton = new ButtonBuilder()
        .setCustomId('kickUser')
        .setLabel("📤")
        .setStyle(ButtonStyle.Secondary);

    const adjustBitrateButton = new ButtonBuilder()
        .setCustomId('adjustBitrate')
        .setLabel("⚙️")
        .setStyle(ButtonStyle.Secondary);

    const setRoomSlotsButton = new ButtonBuilder()
        .setCustomId('setRoomSlots')
        .setLabel("🚹")
        .setStyle(ButtonStyle.Secondary);

    const renameRoomButton = new ButtonBuilder()
        .setCustomId('renameRoom')
        .setLabel("✏️")
        .setStyle(ButtonStyle.Secondary);

    const toggleRoomVisibilityButton = new ButtonBuilder()
        .setCustomId('toggleRoomVisibility')
        .setLabel("🔐️")
        .setStyle(ButtonStyle.Secondary);

    const toggleUserAccessButton = new ButtonBuilder()
        .setCustomId('toggleUserAccess')
        .setLabel("🔑")
        .setStyle(ButtonStyle.Secondary);

    const roomControlRowPrimary = new ActionRowBuilder()
        .addComponents(
            addUserSlotButton,
            lockRoomButton,
            toggleMuteUserButton,
            setRoomSlotsButton,
            adjustBitrateButton
        );

    const roomControlRowSecondary = new ActionRowBuilder()
        .addComponents(
            removeUserSlotButton,
            toggleRoomVisibilityButton,
            kickUserButton,
            renameRoomButton,
            toggleUserAccessButton
        );

    return [roomControlRowPrimary, roomControlRowSecondary]
};

module.exports = settingsVoiceButtons;