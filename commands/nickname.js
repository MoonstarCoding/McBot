module.exports = {
    name: "nickname",
    desc: "Customize the name of a user",
    aliases: ["nick", "name", "nn"],
    requiredRole: "crewTrainer",
    run: function (Discord, client, message, args) {
        if (!message.mentions.members.first()) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** No User Tagged", [
            ["Proper Usage: ", "!nickname @McBot#7516 McBot"]
        ]); //? PLease tag user (Show usage)
        
        if (!args[1]) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** No Nickname Given", [
            ["Proper Usage: ", "!nickname @McBot#7516 McBot"]
        ]); //? Please say a new nickname
        
        args.shift()
        let nickname = args.join(" ")

        message.mentions.members.first().setNickname(nickname, message.member.displayName + " Changed " + message.mentions.members.first().displayName + " Name")
    }
}