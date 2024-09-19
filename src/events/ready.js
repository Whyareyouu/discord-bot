const { Events } = require("discord.js");
const database = require("../dbModels");
const { Users } = require("../dbModels");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    Object.values(database).forEach(async (model) => await model.sync());
    console.log(`Ready! Logged in as ${client.user.tag}`);
    try {
      const guild = await client.guilds.fetch(process.env.GUILD_ID);

      const members = await guild.members.fetch();

      for (const [id, member] of members) {
        const existingUser = await Users.findOne({
          where: { userId: id },
          raw: true,
        });

        if (!existingUser) {
          await Users.create({
            userId: id,
            userTag: member.user.tag,
            balance: 0,
          });
        }
      }
    } catch (e) {
      console.error("Error fetching members:", e);
    }
  },
};
