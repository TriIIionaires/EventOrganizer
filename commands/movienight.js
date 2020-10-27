const { DiscordAPIError } = require('discord.js');

module.exports = {
    name: 'movienight',
    description: 'Create movie night',
    execute(Discord, Client, message, args) {
        //Prechecks
        if (!message.member.roles.cache.has('741175413262516324') && !message.member.roles.cache.has('741801901833846829')) {            
            message.channel.send('You cannot create a movie night!')
                .catch(console.error);
            return;
        } else {
            message.delete()
                .catch(console.error);
        };

        //Variables
        const user = message.author;
        const channel = Client.channels.cache.get('741549843792527360'); //Staff Channel
        const key = require('../handlers/handler.js').CreateID(Client, 'MN');

        let PLAYERS = [];
        Client.events.set(key, {host: user, members: PLAYERS, hasStarted: false});

        const Event = Client.events.get(key);
        const Filter = require('../handlers/filter.js');
        const Questions = require('../config.json').MovieNight;

        //Functions      
        async function CreateEmbed() {
            const EventEmbed = new Discord.MessageEmbed()
                .setColor('#000000')
                .setTitle('Movie Night')
                .setAuthor('Original People™', `${channel.guild.iconURL()}`)
                .setDescription(`Host: **<@!${user.id}>**\nTime: **${Event.date}, ${Event.time}**\nMovie: **${Event.movie}**\nAttendees: **${Event.members.length}**`)
                .addField('Actions', '▶️ Enter\n↩️ Exit')
                .setTimestamp()
                .setFooter('Made with EventOrganizer');
            
            const message = await channel.send('@everyone', EventEmbed) //Ghost ping
            Event.message = message;
            setTimeout(function () {}, 100);
            await message.edit('',EventEmbed);
            await message.react('▶️')
                .catch(console.error);
            await message.react('↩️')
                .catch(console.error);

            await user.send(`Your movie night has been created! ${key} is your key to edit this event.`)
                .catch(console.error);
            
            let filter = async function (reaction, user) {
                if (reaction.emoji.name === '▶️') {
                    for (let player of PLAYERS) {
                        if (user.id == player) {
                            user.send('You are already entered in the movie night!'); 
                            return;
                        };
                    };
                    PLAYERS.push(user.id);
                    Event.members = PLAYERS;

                    await UpdateEmbed(message);
                    await user.send('You have entered in the movie night!')
                        .catch(console.error);                
                } else if (reaction.emoji.name === '↩️') {
                    for (let player of PLAYERS) {
                        if (user.id == player) {
                           for (i = 0; i < PLAYERS.length; i++) {
                                if (PLAYERS[i] == user.id) {
                                    PLAYERS = PLAYERS.slice(0, i).concat(PLAYERS.slice(i+1, PLAYERS.length));
                                    Event.members = PLAYERS;
                                };
                            };
                            await UpdateEmbed(message);
                            await user.send('You have exited the movie night!')
                                .catch(console.error);
                            return;
                        };
                    };
                    await user.send('You are not entered in the movie night!')
                        .catch(console.error);
                };
            };
            message.awaitReactions(filter);
        };

        async function UpdateEmbed(message) {
            const UpdatedEmbed = new Discord.MessageEmbed()
                .setColor('#000000')
                .setTitle('Movie Night')
                .setAuthor('Original People™', `${channel.guild.iconURL()}`)
                .addField('Actions', '▶️ Enter\n↩️ Exit')
                .setTimestamp()
                .setFooter('Made with EventOrganizer');
            
            
            await UpdatedEmbed.setDescription(`Host: **<@!${user.id}>**\nTime: **${Event.date}, ${Event.time}**\nMovie: **${Event.movie}**\nAttendees: **${Event.members.length}**`);
            await message.edit(UpdatedEmbed);
        };

        async function SetupEvent() {
            let CurrentStep = 0;

            const listener = (response) => {
                if (response.author.bot || response.channel.type !=='dm') return;
                
                if (response.content.toLowerCase() !== 'cancel' && response.content.toLowerCase() !== 'back') {
                    if (CurrentStep === 0) {
                        if (Filter.Date(response.content) !== false) {
                            Event.date = Filter.Date(response.content);
                            console.log(`Date set to ${Event.date}`);
                        } else {
                            response.reply('That is not a valid date!');
                            return;
                        }; 
                    } else if (CurrentStep === 1) {
                        if (Filter.Time(response.content) !== false) {
                            Event.time = Filter.Time(response.content);
                            console.log(`Time set to ${Event.time}`);
                        } else {
                            response.reply('That is not a valid time!');
                            return;
                        };
                    } else if (CurrentStep === 2) {
                        Event.movie = response.content;
                        console.log(`Game set to ${Event.movie}`);
                    };

                    if (CurrentStep !== Questions.length-1) {
                        CurrentStep = CurrentStep + 1;
                        response.reply(Questions[CurrentStep]); 
                    } else if (CurrentStep === Questions.length-1) {
                        Client.off('message', listener);
                        Client.debounce.get(user.id).debounce = false;
                        CreateEmbed();
                    };
                } else if (response.content.toLowerCase() === 'back') {
                    if (CurrentStep !== 0) {
                        CurrentStep = CurrentStep - 1;
                        response.reply(Questions[CurrentStep]);
                    } else if (CurrentStep === 0) {
                        response.reply('You cannot go back!')
                    }
                } else if (response.content.toLowerCase() === "cancel") {
                    Client.off('message', listener);
                    Client.debounce.get(user.id).debounce = false;
                    response.reply('Successfully cancelled the setup!');
                    return;
                };
            };
            Client.on('message', listener); 

            await user.send(Questions[CurrentStep]) 
                .catch(async function (error) {
                    if (error.code === 50007) {
                        await message.channel.send(`<@!${user.id}> I cannot send you a DM! Please open direct messages from server members!`);
                        Client.off('message', listener);
                        return;
                    } else {
                        console.error;
                    }
                });           
        };
        SetupEvent();
    }
};