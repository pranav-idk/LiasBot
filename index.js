require(`dotenv`).config();

const Discord = require('discord.js');

const bot = new Discord.Client();

const guildMemberAdd = require('./support/guildMemberAdd.js')
bot.on('guildMemberAdd', member => {
    console.log(member.user.tag)
    guildMemberAdd(bot, member)
});

bot.on('message', async message => {
    if (message.content.toLowerCase() === "!fire") return bot.emit('guildMemberAdd', message.member);
});

bot.login(process.env.TOKEN);