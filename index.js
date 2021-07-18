require(`dotenv`).config();
require('./support/server.js').init();

const Discord = require('discord.js');
const mongoose = require('mongoose');

const bot = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER"] });
bot.commands = new Discord.Collection();

const guildMemberAdd = require('./support/guildMemberAdd.js');
const logs = require(`./support/logs.js`);
const config = require(`./config.json`);

mongoose.connect(process.env.DB_LINK, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(console.log(`Connected to MongoDB successfully!`));

bot.on('ready', () => {
    console.log(`${bot.user.username} came online!`);

    bot.user.setPresence({ activity: { name: `with ${bot.users.cache.get(config.OWNERS[0]).tag}!` } })
        .then(() => {
            console.log(`Changed the presence of ${bot.user.username} to "${bot.user.presence.activities[0].name}".`);
            logs.loginLog(bot);
            require(`./support/reload.js`).deleteAllCache(`./commands`, bot);
        })
        .catch(console.error);
});

bot.on('guildMemberAdd', member => guildMemberAdd(bot, member));

// bot.on('message', async message => {
//     if (message.content.toLowerCase() === "!fire") return bot.emit('guildMemberAdd', message.member);
// });

bot.on('message', async message => {
    //Ignore bots amd webhooks
    if (message.author.bot) return;
    if (message.webhookID) return;

    const prefix = require(`./support/prefix.js`)(message, bot.user.id);

    // Prefix validation
    if (!prefix) return;

    // Util variables
    var msg = message.content;
    var cont = msg.slice(prefix.length).split(/ +/);
    var command = cont[0].toLowerCase();
    var args = cont.slice(1);

    // Reload command
    if (command === 'reload')
        return require(`./support/reload.js`).reload(bot, message, args, config.OWNERS, config.STAFF);

    // Command fetching
    var cmd = bot.commands.get(command) || bot.commands.find(c => c.config.aliases && c.config.aliases.includes(command));
    if (!cmd) return logs.noCommandLog(bot, command, message, args);

    // Staff only commands
    let isStaffOnly = staffOnly(cmd, message.author.id);
    if (isStaffOnly) return message.channel.send(isStaffOnly);

    // Guild only commands
    if (cmd.config.guildOnly && message.channel.type !== 'text')
        return message.reply(`I can't execute the ${cmd.config.name} command inside DMs!`);

    // Run the command
    logs.commandLog(bot, cmd, message, args, config);
    cmd.run(bot, message, args, config);
});

const staffOnly = (cmd, authorId) => {
    if (cmd.config.staffOnly)
        if (!config.OWNERS.includes(authorId) && !config.STAFF.includes(authorId))
            return new Discord.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`Staff access only.\nAccess denied.`)
                .setColor(`ff0000`)
}

bot.login(process.env.TOKEN);