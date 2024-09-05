const { Events } = require('discord.js');
const database = require("../dbModels");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        Object.values(database).forEach(async (model) => await model.sync());
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};