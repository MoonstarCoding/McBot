module.exports = {
    name: "ban",
    desc: "Remove user from server forever.",
    requiredRole: "teamLeader",
    run: function(Discord, client, message, args) {
        let member = message.mentions.members.first();
            member.ban().then((member) => {
                message.channel.send(`User ${message.author} has banned ${member.displayName}. :wave:`)
            });
    }
}