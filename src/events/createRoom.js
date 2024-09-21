const { Events, ChannelType, PermissionsBitField } = require("discord.js");
const { UserRooms } = require("../dbModels");
module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    const guild = newState.guild;

    if (newState.channelId === process.env.CREATE_ROOM_CHANNEL_ID) {
      const user = newState.member.user;

      const checkActiveRoom = await UserRooms.findOne({
        where: { userId: user.id },
        raw: true,
      });

      if (checkActiveRoom) {
        const existingChannel = guild.channels.cache.get(
          checkActiveRoom.roomId,
        );

        if (existingChannel) {
          await existingChannel.delete();
        }

        await UserRooms.destroy({ where: { roomId: checkActiveRoom.roomId } });
      }

      const newChannel = await guild.channels.create({
        name: `${user.username}'s Room`,
        type: ChannelType.GuildVoice,
        parent: newState.channel.parentId,
        userLimit: 10,
        permissionOverwrites: [
          {
            id: user.id,
            allow: [
              PermissionsBitField.Flags.Connect,
              PermissionsBitField.Flags.ViewChannel,
            ],
          },
        ],
      });

      await newState.setChannel(newChannel);

      await UserRooms.create({
        userId: user.id,
        roomId: newChannel.id,
      });
    }

    if (
      oldState.channel &&
      oldState.channelId !== process.env.CREATE_ROOM_CHANNEL_ID
    ) {
      if (oldState.channel.members.size === 0) {
        try {
          await UserRooms.destroy({
            where: { roomId: oldState.channel.id },
          });
          await oldState.channel.delete();
        } catch (e) {
          console.error(e);
        }
      }
    }
  },
};
