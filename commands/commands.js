const { DiscordAPIError } = require('discord.js');

module.exports = {
    name: 'commands',
    description: 'List of commands',
    execute(Discord, message) {
        //Prechecks
        if (!message.member.roles.cache.has('741175413262516324') && !message.member.roles.cache.has('741801901833846829')) {            
            message.channel.send('You do not have access to EventOrganizer commands!')
                .catch(console.error);
            return;
        };

        //Variables
        const channel = message.channel;

        const commandList = new Discord.MessageEmbed()
            .setTitle('**EventOrganizer Commands**')
            .setDescription('**Create Commands**\n!create gamenight - Make a game night\n!create movienight - Make a movie night\n\n**Edit Commands**\n!edit date [key] - Change the time\n!edit time [key] - Change the time\n!edit capacity [key] - Change the capacity\n!edit game [key] - Change the game\n!edit movie [key] - Change the movie\n\n**Event Commands**\n!event start [key] - Start the event\n!event end [key] - End the event');
        channel.send(commandList);
    }
}