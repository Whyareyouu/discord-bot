const {Events, ChannelType} = require('discord.js');
const CREATE_ROOM_CHANNEL_ID = '1281571057798742076';
module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const guild = newState.guild;
        //
        // Проверяем, зашел ли пользователь в "Создать комнату"
        if (newState.channelId === CREATE_ROOM_CHANNEL_ID) {
            console.log("Пользователь зашел в create room")
            const user = newState.member.user;

            // Создаем новый голосовой канал с ником пользователя
            const newChannel = await guild.channels.create({
                name: `${user.username}'s Room`,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parentId,
            });


            await newState.setChannel(newChannel);

        }
        //
        if (oldState.channel && oldState.channelId !== CREATE_ROOM_CHANNEL_ID) {
            if (oldState.channel.members.size === 0) {
                await oldState.channel.delete();
            }
        }
    }
};