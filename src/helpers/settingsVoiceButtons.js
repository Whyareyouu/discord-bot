const { ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const {ADD_USER_SLOT, REMOVE_USER_SLOT, LOCK_ROOM, TOGGLE_MUTE_USER, KICK_USER, ADJUST_BITRATE, SET_ROOM_SLOTS,
    RENAME_ROOM, TOGGLE_ROOM_VISIBILITY, TOGGLE_USER_ACCESS
} = require("../commands/constants/buttonsIds");

const settingsVoiceButtons = () => {
    const addUserSlotButton = new ButtonBuilder()
        .setCustomId(ADD_USER_SLOT)
        .setLabel("➕")
        .setStyle(ButtonStyle.Secondary);

    const removeUserSlotButton = new ButtonBuilder()
        .setCustomId(REMOVE_USER_SLOT)
        .setLabel("➖")
        .setStyle(ButtonStyle.Secondary);

    const lockRoomButton = new ButtonBuilder()
        .setCustomId(LOCK_ROOM)
        .setLabel("🔒")
        .setStyle(ButtonStyle.Secondary);

    const toggleMuteUserButton = new ButtonBuilder()
        .setCustomId(TOGGLE_MUTE_USER)
        .setLabel("🔊")
        .setStyle(ButtonStyle.Secondary);

    const kickUserButton = new ButtonBuilder()
        .setCustomId(KICK_USER)
        .setLabel("📤")
        .setStyle(ButtonStyle.Secondary);

    const adjustBitrateButton = new ButtonBuilder()
        .setCustomId(ADJUST_BITRATE)
        .setLabel("⚙️")
        .setStyle(ButtonStyle.Secondary);

    const setRoomSlotsButton = new ButtonBuilder()
        .setCustomId(SET_ROOM_SLOTS)
        .setLabel("🚹")
        .setStyle(ButtonStyle.Secondary);

    const renameRoomButton = new ButtonBuilder()
        .setCustomId(RENAME_ROOM)
        .setLabel("✏️")
        .setStyle(ButtonStyle.Secondary);

    const toggleRoomVisibilityButton = new ButtonBuilder()
        .setCustomId(TOGGLE_ROOM_VISIBILITY)
        .setLabel("🔐️")
        .setStyle(ButtonStyle.Secondary);

    const toggleUserAccessButton = new ButtonBuilder()
        .setCustomId(TOGGLE_USER_ACCESS)
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