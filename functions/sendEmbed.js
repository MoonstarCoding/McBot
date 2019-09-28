module.exports = async function(Discord, client, message, customChannel = false, channel = {}, title = false, desc = false, fields = false, footer = false) {
    let Embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("#DA291C")
        .setAuthor("McBot", client.user.displayAvatarURL())
    if (title) Embed.setTitle(title);
    if (desc) Embed.setDescription(desc);
    if (footer) Embed.setFooter(footer);
    if (fields) {
        fields.forEach(field => {
            Embed.addField(field[0], field[1]);
        });
    }
    if (customChannel === true) {
        let messageSent = await channel.send(Embed)
        return messageSent
    } else {
        let messageSent = await message.channel.send(Embed)
        return messageSent
     }
}