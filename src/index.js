const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, Events, GatewayIntentBits, Partials} = require('discord.js');
const database = require('./dbModels.js');
const {getSuggestModal, getSuggestEmbed} = require('./helpers/suggestHelpers.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'suggest_event') {
        const modalComponent = await getSuggestModal();
        await interaction.showModal(modalComponent)

    }
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'suggest_event_modal') {
        await interaction.reply({ content: 'Вы успешно заказали событие', ephemeral: true });
        const field = interaction.fields.getTextInputValue('suggestedEventInput')
        const embed = getSuggestEmbed(interaction.user.username, interaction.user.avatarURL(), field)
        const channel = interaction.client.channels.cache.get(process.env.CLIENT_SUGGEST_ROOM_ID);
        await channel.send({embeds: [embed]})
    }
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(process.env.TOKEN);
