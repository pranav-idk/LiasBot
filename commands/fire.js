exports.config = {
    name: "fire",
    description: "Test command ok",
    usage: "fire",
    category: "Utility",
    guildOnly: false,
    staffOnly: true,
};

exports.run = async(bot, {member}) => {
    bot.emit('guildMemberAdd', member);
};