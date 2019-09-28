module.exports = {
    name: "welcome",
    desc: "Welcome user on first join.",
    aliases: ["wel", "wc", "greet"],
    requiredRole: "crewTrainer",
    run: function (Discord, client, message, args) {
        if (!message.mentions.members.first()) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** No User Tagged", [
            ["Proper Usage: ", "!welcome @McBot#7516 McBot"]
        ]); //? PLease tag user (Show usage)

        if (!args[1]) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** No Nickname Given", [
            ["Proper Usage: ", "!welcome @McBot#7516 McBot"]
        ]); //? Please say a new nickname

        args.shift()
        let nickname = args.join(" ")

        message.mentions.members.first().setNickname(nickname, message.member.displayName + " Changed " + message.mentions.members.first().displayName + " Name")

        client.functions.sendEmbed(Discord, client, message, false, {}, false, `**Welcome:**\n${message.mentions.members.first().displayName} Has Joined the Acton McDonald's Group Chat!`, [
            ["Commands", "```!shift add <position> <date> <start time> <end time>``` ```!shift delete <position> <date>``` ```!shift claim <@user> <position> <date>``` ```!shift release <@user> <position> <date>``` ```!shift find <position>``` ```!commands```"],
            ["For Crew Trainers and Up", "```!nickname <@user> <nickname>``` ```!welcome <@user> <nickname>``` ```!kick <@user>``` ```!ban <@user>```"]
        ]);
    }
}