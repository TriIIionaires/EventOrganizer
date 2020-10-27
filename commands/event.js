const { DiscordAPIError } = require('discord.js');

module.exports = {
    name: 'event',
    description: 'Event commands',
    execute(Discord, Client, message, args) {
        //Prechecks
        if (!message.member.roles.cache.has('741175413262516324') && !message.member.roles.cache.has('741801901833846829')) {            
            message.channel.send('You cannot run event commands!')
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

        if (Event) {
            if (user.id === Event.host.id) {
               if (args[0] === 'start') {
                    if (Event.hasStarted === false) {
                        let announcement;
                        Event.hasStarted = true;

                        for (const member of Event.members) {
                            if (announcement !== undefined) {
                                announcement = `${announcement} <@!${member}>`;
                            } else {
                                announcement = `<@!${member}>`;
                            }
                        };
                        channel.send(`${announcement} The event you have entered in has just started!`)
                            .catch(console.error);
                    } else {
                        channel.send('The event has already started!')
                            .catch(console.error);
                    };                       
               } else if (args[0] === 'end') {
                    Event.message.delete()
                        .catch(console.error);
                    Client.events.delete(key);

                    channel.send('The event has ended!')
                        .catch(console.error);
               } 
            } else {
                channel.send('You cannot run event commands on an event you aren\'t hosting!')
                    .catch(console.error);
            };
        } else {
            channel.send('That is not a valid key!')
                .catch(console.error);
        }
    }
};