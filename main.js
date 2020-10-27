const Discord = require('discord.js')
const Client = new Discord.Client();
const {prefix, token} = require('./config.json');
const {eventCommands, editCommands, createCommands} = require('./config.json');

const fs = require('fs');

Client.commands = new Discord.Collection();
Client.events = new Discord.Collection();
Client.debounce = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    Client.commands.set(command.name, command);
};

Client.once('ready', () => {
    let date = new Date().toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/,'');
    console.log(`${date} Client is online`);
});

Client.on('message', (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    if (Client.debounce.get(message.author.id)) {
        if (Client.debounce.get(message.author.id).debounce === true) {
            message.channel.send(`<@!${message.author.id}> Please cancel the current process to run another command!`)
                .catch(console.error);
            return;
        };
    } else {
        Client.debounce.set(message.author.id, {debounce: false});
    };

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (command === 'create'){
        if (createCommands.includes(args[0].toLowerCase())) {
            Client.debounce.get(message.author.id).debounce = true;
            Client.commands.get(args[0]).execute(Discord, Client, message, args);
        };
    } else if (command === 'edit') {
        if (editCommands.includes(args[0].toLowerCase())) {
            Client.debounce.get(message.author.id).debounce = true;
            Client.commands.get('edit').execute(Discord, Client, message, args);
        };
    } else if (command === 'event') {
        if (eventCommands.includes(args[0].toLowerCase())) {
            Client.commands.get('event').execute(Discord, Client, message, args);
        };
    } else if (command === 'commands') {
        Client.commands.get('commands').execute(Discord, message);
    } 
});

Client.login(token);