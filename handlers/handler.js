function CreateID(Client, type) {
    function NewID() {
        let ID = Math.random()
            .toString()
            .replace('0.','');
        return ID;
    };

    let ID = `${type}_${NewID()}`;
    
    for (let i = 0; i < Client.events.length; i++) {
        if (Events[i] == ID) {
            ID = `${type}_${NewID()}`;
        };
    };
    return ID;
};

function addEmbed(Discord, Event, key) {
    const Embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setAuthor('Original People™', `${Event.message.channel.guild.iconURL()}`)
        .addField('Actions', '▶️ Enter\n↩️ Exit')
        .setTimestamp()
        .setFooter('Made with EventOrganizer'); 
    if (key.slice(0,2) === 'GN') {
        Embed
            .setTitle('Game Night')
            .setDescription(`Host: **<@!${Event.host.id}>**\nTime: **${Event.date}, ${Event.time}**\nGame: **${Event.game}**\nPlayers: **${Event.members.length}/${Event.capacity}**`);
    } else if (key.slice(0,2) === 'MN') {
        Embed
            .setTitle('Movie Night')
            .setDescription(`Host: **<@!${Event.host.id}>**\nTime: **${Event.date}, ${Event.time}**\nMovie: **${Event.movie}**\nAttendees: **${Event.members.length}**`);       
    };
    return Embed;
};

function findQuestion(args) {
    if (args === 'date') {
        return 'What is the date of your event? **MONTH DAY**\n\n:arrow_down: ENTER DATE :arrow_down:';
    } else if (args === 'time') {
        return 'What is the time when your event will start? **00:00 A.M./P.M.**\n\n:arrow_down: ENTER TIME :arrow_down:';
    } else if (args === 'capacity') {
        return 'How many players will be allowed to join?\n\n:arrow_down: ENTER NUMBER :arrow_down:';
    } else if (args === 'game') {
        return 'What game are you playing?\n\n:arrow_down: ENTER GAME TITLE :arrow_down:';
    } else if (args === 'movie') {
        return 'What movie are you watching?\n\n:arrow_down: ENTER GAME TITLE :arrow_down:';
    }
};

module.exports = {
    CreateID: CreateID,
    addEmbed: addEmbed,
    findQuestion: findQuestion
}