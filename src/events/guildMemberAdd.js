const { Events } = require('discord.js');
const { Users } = require("../dbModels");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const existingUser = await Users.findOne({ where: { userId: member.id }, raw: true });

            if (!existingUser) {
                await Users.create({
                    userTag: member.user.tag,
                    userId: member.id,
                    balance: 0
                });
                console.log(`Пользователь ${member.user.tag} добавлен в базу данных.`);
            } else {
                console.log(`Пользователь ${member.user.tag} уже существует в базе данных.`);
            }
        } catch (error) {
            console.error('Ошибка при добавлении пользователя в базу данных:', error);
        }
    },
};