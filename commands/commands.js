module.exports = {
    name: "commands",
    desc: "A List of Commands Available and to Whom.",
    aliases: ["command"],
    requiredRole: "crew",
    run: function (Discord, client, message, args) {

    client.functions.sendEmbed(Discord, client, message, false, {}, false, "Here you go!", [
            ["Commands", "```!shift add <position> <date> <start time> <end time>``` ```!shift delete <position> <date>``` ```!shift claim <@user> <position> <date>``` ```!shift release <@user> <position> <date>``` ```!shift find <position>``` ```!commands```"],
            ["For Crew Trainers and Up", "```!nickname <@user> <nickname>``` ```!welcome <@user> <nickname>``` ```!kick <@user>``` ```!ban <@user>```"]
        ]);
    }
}