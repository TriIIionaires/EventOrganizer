const { DiscordAPIError } = require('discord.js');

module.exports = {
    name: 'edit',
    description: 'Edit event',
    execute(Discord, Client, message, args) {
        //Prechecks
        if (!message.member.roles.cache.has('741175413262516324') && !message.member.roles.cache.has('741801901833846829')) {            
            message.channel.send('You cannot edit an event!')
                .catch(console.error);
            return;
        } else if (args[1].slice(0,2) === 'MN' && args[0] === 'capacity') {
            message.channel.send('Movie nights don\'t have a capacity!')
                .catch(console.error);
            return;
        } else if (args[1].slice(0,2) === 'MN' && args[0] === 'game') {
            message.channel.send('Movie nights don\'t have a game!')
                .catch(console.error);
            return;
        } else if (args[1].slice(0,2) === 'GN' && args[0] === 'movie') {
            message.channel.send('Game nights don\'t have a movie!')
                .catch(console.error);
            return;
        } else {
            message.delete()
                .catch(console.error);
        };

        //Variables
        const user = message.author;
        const channel = message.channel;
        const key = args[1];

        const Event = Client.events.get(key);
        const Filter = require('../handlers/filter.js');
        const Handler = require('../handlers/handler.js');

        if (Event) {
            if (user.id === Event.host.id) {
                const listener = async function (response) {
                    if (response.author.bot || response.channel.type !== 'dm') return;

                    if (args[0] === 'date') {
                        if (Filter.Date(response.content) !== false) {
                            Event.date = Filter.Date(response.content);
                        } else {
                            user.send('That is not a valid date!')
                                .catch(console.error);
                            return;
                        };
                    } else if (args[0] === 'time') {
                        if (Filter.Time(response.content) !== false) {
                            Event.time = Filter.Time(response.content);
                        } else {
                            await user.send('That is not a valid time!')
                                .catch(console.error);
                            return;
                        };
                    } else if (args[0] === 'capacity') {
                        if (Filter.Number(response.content, 1) !== false) {
                            Event.capacity = Filter.Number(response.content, 1);
                        } else {
                            await user.send('That is not a valid number!')
                                .catch(console.error);
                            return;
                        };
                    } else if (args[0] === 'game') {
                        Event.game = response.content;
                    } else if (args[0] === 'movie') {
                        Event.movie = response.content;
                    };
                    Client.off('message', listener);
                    Client.debounce.get(user.id).debounce = false;

                    await Event.message.edit(Handler.addEmbed(Discord, Event, key));

                    await user.send('You successfully edited your event!')
                        .catch(console.error);
                }
                Client.on('message', listener); 

                user.send(Handler.findQuestion(args[0])) 
                    .catch(async function (error) {
                        if (error.code === 50007) {
                            await channel.send(`<@!${user.id}> I cannot send you a DM! Please open direct messages from server members!`);
                            Client.off('message', listener);
                            return;
                        } else {
                            console.error;
                        }
                    });
            } else {
                channel.send('You cannot edit an event you aren\'t hosting!')
                    .catch(console.error);
            };
        } else {
            channel.send('That is not a valid key!')
                .catch(console.error);
        };
    }
};