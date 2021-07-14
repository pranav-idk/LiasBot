const { MessageEmbed } = require('discord.js')

module.exports = async bot => {
    bot.on('messageDelete', async message => {
        if (!message.guild) return;
        var dMsgEmbed = new MessageEmbed()
            .setTitle(`Message Deleted`)
            .setThumbnail(message.member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setFooter(`${bot.user.username}@2020. !help for help.`)
        var fetchedLogs = await message.guild.fetchAuditLogs({ limit: 1, type: 'MESSAGE_DELETE' });
        var deletionLog = fetchedLogs.entries.first();
        if (!deletionLog) return;
        var { executor, target } = deletionLog;
        dMsgEmbed.setDescription(`Message by ${message.author} was deleted in ${message.channel}`)
        if (target.id === message.author.id) dMsgEmbed.setDescription(`${dMsgEmbed.description} by ${executor}.`)
        var msgChannel = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === 'message-logs')
        dMsgEmbed.setDescription(`${dMsgEmbed.description}\n**Message**: ${message}`)
        if (msgChannel) msgChannel.send(dMsgEmbed)
    });
    bot.on('guildMemberRemove', async member => {
        var kMsgEmbed = new MessageEmbed()
            .setTitle(`Member Left`)
            .setDescription(`${message.author.member} has left the server.`)
            .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setFooter(`${bot.user.username}@2020. !help for help.`)
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        const kickLog = fetchedLogs.entries.first();
        var modChannel = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === 'member-logs')
        if (!kickLog) if (modChannel) return modChannel.send(kMsgEmbed) 
        const { executor, target } = kickLog;
        if (target.id === member.id) {
            kMsgEmbed.setTitle(`Member Kicked`)
            kMsgEmbed.setDescription(`${message.member} was kicked by ${executor.tag}`)
            modChannel.send(kMsgEmbed)
        };
    });
};