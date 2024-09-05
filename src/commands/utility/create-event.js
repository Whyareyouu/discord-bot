const {SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require('discord.js');
const {EventList} = require("../../dbModels.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-event')
        .setDescription('Provides information about the user.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Название которое будет отображаться в заголовке ивента')
                .setRequired(true)
                .setMaxLength(255))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Описание ивента')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('banner')
                .setDescription('ссылка на гифку или картинку, которая будет отображаться в ивенте')
                .setRequired(true)
                .setMaxLength(255)),

    async execute(interaction) {

        const options = interaction.options?._hoistedOptions;

        const acceptCreateEvent = new ButtonBuilder()
            .setCustomId('accept_create_event')
            .setLabel('✅')
            .setStyle(ButtonStyle.Success);

        const cancelCreateEvent = new ButtonBuilder()
            .setCustomId('cancel_create_event')
            .setLabel('⛔')
            .setStyle(ButtonStyle.Danger);

        const announceEventActionRow = new ActionRowBuilder()
            .addComponents(acceptCreateEvent, cancelCreateEvent);

        if(!options){
            await interaction.reply({content: "Произошла ошибка при создании ивента", ephemeral: true});
            return
        }
        try{
            const transformedOptions = options?.reduce((acc, option) => ({...acc,[option.name]: option.value }), {})
            const embed = new EmbedBuilder()
                .setTitle(`🔔  Ивент — ${transformedOptions?.title}`)
                .setDescription('```' + transformedOptions?.description + '```')
                .setFields({name: "Игроков", value: "0", inline: true}, {
                    name: "Награда за участие",
                    value: "75 🪙",
                    inline: true
                })
                .setImage(transformedOptions.banner);

            const message = await interaction.reply({content: "Пример добавляемого ивента",embeds: [embed], components: [announceEventActionRow], ephemeral: true});
            const filter = i => i.user.id === interaction.user.id;
            try {
                const confirmation = await message.awaitMessageComponent({filter, time: 60000})
                if(confirmation.customId === 'accept_create_event'){
                    await EventList.create(transformedOptions);
                    await confirmation.update({content: "Ивент был создан",embeds: [],components: [], ephemeral: true})
                }
                else if(confirmation.customId === 'cancel_create_event'){
                    await confirmation.update({content: "Создание ивента было отменено",embeds: [],components: [], ephemeral: true})
                }
            }catch (e) {
                if(e?.name === "SequelizeUniqueConstraintError"){
                    await interaction.followUp({ content:`Произошла ошибка при обработке вашего запроса. Попробуйте снова.\n\n Ошибка: ${e?.parent?.detail}`, ephemeral: true });
                    return
                }
                await interaction.followUp({ content:`Произошла ошибка при обработке вашего запроса. Попробуйте снова.`, ephemeral: true });
            }
        }catch (e) {
            console.log(e)
            await interaction.followUp({ content: "Произошла ошибка при создании ивента. Попробуйте снова.", ephemeral: true });
        }

    },
};