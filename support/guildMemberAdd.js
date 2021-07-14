const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require('canvas');
const path = require(`path`);

Canvas.registerFont(path.join(__dirname, '../fonts', "moonget.ttf"), { family: "moonget" })

module.exports = async (bot, member) => {
    const canvas = Canvas.createCanvas(700, 205);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./assets/image-backgrounds/image1.png');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.shadowColor = "black";
    ctx.shadowBlur = 15;
    ctx.font = '35px moonget';
    ctx.fillStyle = '#b35c40';
    ctx.fillText(member.user.tag, 20, 135);

    ctx.shadowBlur = 0
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.strokeText(member.user.tag, 20, 135);

    bot.channels.cache.get('864735710471520287').send(`Welcome to **${member.guild.name}**, ${member}! Make sure to read the <#864735394314715136>.`, new MessageAttachment(canvas.toBuffer(), 'welcome-image.png'));
};