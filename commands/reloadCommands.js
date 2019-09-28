module.exports = {
    name: "reload",
    desc: "Reload all Commands",
    aliases: false,
    requiredRole: "developer",
    run: function (Discord, client, message, args) {
        client.mcBotUtils.reloadExternalFiles(client, Discord);
        client.functions.sendMessage(Discord, client, message, "Reloading All Commands & Functions");
    }
}