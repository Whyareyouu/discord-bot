const { Events, EmbedBuilder} = require('discord.js');
const {EventList} = require("../dbModels.js");
const {paginate} = require("../helpers/pagination.js");
const getSubmitButtons = require("../helpers/submitButtons.js");
const getEmbedForEvent = require("../helpers/eventEmbedBuilder");
const {ANNOUNCE_EVENT} = require("../commands/constants/buttonsIds");
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId === ANNOUNCE_EVENT) {
            const events = await EventList.findAll({raw: true});
            const announceEvent = async (eventId, interaction) => {
                const event = await EventList.findOne({where: {id: eventId}, raw:true});

                const embed = new EmbedBuilder()
                    .setDescription(`Ты хочешь анонсировать ивент ${event.title}?\n На ответ у тебя есть минута`)

                const submitButtons = getSubmitButtons("submit_announce_event", "cancel_submit_event");

                const message = await interaction.reply({embeds: [embed],components: [submitButtons], errors: ["time"], ephemeral: true, fetchReply: true});

                const filter = i => i.user.id === interaction.user.id;

                try {
                    const confirmation = await message.awaitMessageComponent({filter, time: 60_000})
                    console.log(confirmation.customId)
                    if(confirmation.customId === 'submit_announce_event'){
                        const channel = confirmation.client.channels.cache.get(process.env.CLIENT_EVENT_ROOM_ID);
                        const eventEmbed = getEmbedForEvent({...event, username: interaction.user.username, iconURL: interaction.user.avatarURL()});
                        await channel.send({embeds: [eventEmbed]})
                        await confirmation.update({content: "Вы успешно анонсировали ивент",embeds:[], components: [], ephemeral: true});
                    }else if(confirmation.customId === 'cancel_submit_event'){
                        await confirmation.update({content: "Нет, так нет.",embeds:[], components: [], ephemeral: true});
                    }
                }catch (e) {
                    await interaction.update({content: "Время вышло",embeds:[], components: [], ephemeral: true});
                }
            }
            await paginate(interaction, events, 60_000, announceEvent);
        }
    },
};