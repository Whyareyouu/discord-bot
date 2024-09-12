const { Events, EmbedBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder,} = require('discord.js');
const { UserRooms } = require("../dbModels");
const { ADD_USER_SLOT, REMOVE_USER_SLOT, TOGGLE_ROOM_VISIBILITY, LOCK_ROOM, KICK_USER, TOGGLE_MUTE_USER, ADJUST_BITRATE,
    SET_ROOM_SLOTS, RENAME_ROOM, TOGGLE_USER_ACCESS
} = require("../commands/constants/buttonsIds");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const errorEmbed = new EmbedBuilder().setTitle("Приватные комнаты").setDescription("Не удалось найти твой канал!")

        const userId = interaction.member.user.id;


        const userRoom = await UserRooms.findOne({ where: { userId }, raw: true });
        const voiceChannel = interaction.guild.channels.cache.get(userRoom.roomId);

        if(!userRoom || !voiceChannel){
            await interaction.reply({embeds: [errorEmbed], ephemeral: true})
            return
        }

        const everyoneRole = interaction.guild.roles.everyone;
        const members = voiceChannel.members;


        switch (interaction.customId) {
            case ADD_USER_SLOT:
                if (voiceChannel.userLimit === 25) {
                    await interaction.reply({ content: 'Максимум слотов достигнут.', ephemeral: true });
                    return;
                }
                await voiceChannel.setUserLimit(voiceChannel.userLimit + 1);
                await interaction.reply({ content: 'Добавлен 1 слот.', ephemeral: true });
                break;

            case REMOVE_USER_SLOT:
                if (voiceChannel.userLimit === 1) {
                    await interaction.reply({ content: 'Минимум слотов достигнут.', ephemeral: true });
                    return;
                }
                await voiceChannel.setUserLimit(voiceChannel.userLimit - 1);
                await interaction.reply({ content: 'Убран 1 слот.', ephemeral: true });
                break;

            case LOCK_ROOM:
                const permissions = voiceChannel.permissionsFor(everyoneRole).has(PermissionsBitField.Flags.Connect);

                await voiceChannel.permissionOverwrites.edit(everyoneRole, {
                    Connect: !permissions
                });

                await interaction.reply({ content: `Теперь доступ к каналу ${permissions ? 'запрещён' : 'разрешён'}.`, ephemeral: true });
                break;

            case TOGGLE_ROOM_VISIBILITY:
                const viewPermissions = voiceChannel.permissionsFor(everyoneRole).has(PermissionsBitField.Flags.ViewChannel);

                await voiceChannel.permissionOverwrites.edit(everyoneRole, {
                    ViewChannel: !viewPermissions
                });

                await interaction.reply({ content: `Теперь комната ${viewPermissions ? 'невидима' : 'видима'}.`, ephemeral: true });
                break;

            case KICK_USER:
                console.log(members)
                // const member = interaction.options.getMember('user');
                //
                // if (!member.voice.channel || member.voice.channel.id !== voiceChannel.id) {
                //     await interaction.reply({ content: 'Пользователь не находится в этой комнате.', ephemeral: true });
                //     return;
                // }
                //
                // await member.voice.disconnect('Вы были исключены из комнаты');
                // await interaction.reply({ content: `Пользователь ${member.user.tag} исключён из комнаты.`, ephemeral: true });
                break;

            case TOGGLE_MUTE_USER:
                const currentSpeakPermission = voiceChannel.permissionsFor(interaction.member).has('SPEAK');

                await voiceChannel.permissionOverwrites.edit(interaction.member, {
                    SPEAK: !currentSpeakPermission
                });

                await interaction.reply({ content: `Теперь у вас ${currentSpeakPermission ? 'нет' : 'есть'} права говорить.`, ephemeral: true });
                break;

            case ADJUST_BITRATE:
                const maxBitrate = interaction.guild.premiumTier === 3 ? 384000 : 64000;
                const newBitrate = voiceChannel.bitrate === maxBitrate ? 64000 : voiceChannel.bitrate + 32000;

                await voiceChannel.setBitrate(newBitrate);
                await interaction.reply({ content: `Битрейт комнаты изменён на ${newBitrate / 1000} kbps.`, ephemeral: true });
                break;

            case SET_ROOM_SLOTS:
                const roomSlotsModal = new ModalBuilder()
                    .setCustomId('set_room_slots_modal')
                    .setTitle('Укажите количество слотов');

                const slotsInput = new TextInputBuilder()
                    .setCustomId('room_slots_input')
                    .setLabel('Количество слотов (1-99)')
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(1)
                    .setMaxLength(2)
                    .setPlaceholder('Введите число от 1 до 99')
                    .setRequired(true);

                const roomSlotsActionRow = new ActionRowBuilder().addComponents(slotsInput);

                roomSlotsModal.addComponents(roomSlotsActionRow);

                await interaction.showModal(roomSlotsModal);
                break;
            case RENAME_ROOM:
                const renameRoomModal = new ModalBuilder()
                    .setCustomId('rename_room_modal')
                    .setTitle('Укажите новое название комнаты');

                const renameRoomInput = new TextInputBuilder()
                    .setCustomId('room_rename_input')
                    .setLabel('Новое название комнаты')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const renameRoomActionRow = new ActionRowBuilder().addComponents(renameRoomInput);

                renameRoomModal.addComponents(renameRoomActionRow);

                await interaction.showModal(renameRoomModal);
                break;
            case TOGGLE_USER_ACCESS:
                const targetUser = interaction.options.getUser('user');
                const grantAccess = interaction.options.getBoolean('grant');

                if (!targetUser) {
                    await interaction.reply({ content: 'Укажите пользователя.', ephemeral: true });
                    return;
                }

                await voiceChannel.permissionOverwrites.edit(targetUser, {
                    CONNECT: grantAccess
                });

                await interaction.reply({ content: `Доступ для пользователя ${targetUser.tag} был ${grantAccess ? 'выдан' : 'забран'}.`, ephemeral: true });
                break;

            default:
                await interaction.reply({ content: 'Нераспознанная команда.', ephemeral: true });
                break;
        }
    },
};
