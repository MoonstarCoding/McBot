module.exports = {
    name: "kick",
    desc: "Remove user from server temporarily3.",
    requiredRole: "teamLeader",
    run: function (Discord, client, message, args) {
        let member = message.mentions.members.first();
            member.kick().then((member) => {
                message.channel.send(`User ${message.author} has kicked ${member.displayName}. :wave:`)
            });
    }
}