/**
 * 
 * @param {Object} Discord Discord.js 
 * @param {client} client Discord.js Client
 * @param {Object} message Message Object
 * @param {String} content Message To Send
 * @param {Boolean} tagUser Optional — Tag User At Begining Of Message
 * @param {Boolean} customChannel Optional — Send To A Custom Channel
 * @param {Object} channel Optional — Channel Object
 * @returns {Object} Message Object
 */

module.exports = async function(Discord, client, message, content, tagUser = false, customChannel = false, channel = {}) {
    if (customChannel === true) {
        if (tagUser === true) return channel.send(`${message.author.toString()}, ${content}`);
        return channel.send(content);
    } else {
        if (tagUser === true) return message.reply(content);
        return message.channel.send(content);
    }
}