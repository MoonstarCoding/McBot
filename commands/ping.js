module.exports = {
    name: "ping",
    desc: "Pong!",
    aliases: false,
    requiredRole: "developer",
    run: function(Discord, client, message, args) {
        client.functions.sendMessage(Discord, client, message, "Pong!");
    }
}