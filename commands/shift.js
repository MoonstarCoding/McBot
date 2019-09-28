const positions = ["cs", "dt", "bk", "dr", "f/h", "mb", "cafe", "des", "gel", "mt"];
const timeRegex = /((1[0-2]|0[1-9]):([0-5][0-9])([AaPp][Mm]))/;

module.exports = {
    name: "shift",
    desc: "Add/Claim/Release/Find all shifts added to the group chat.",
    aliases: ["shifts", "shft", "shfts"],
    usage: "!shift: Add/Claim/Release/Display/Delete all shifts added to the group chat via this command.",
    requiredRole: "crew",
    run: async function (Discord, client, message, args) {
        const shiftChannel = client.channels.get("601957622106554368");
        const claimedChannel = client.channels.get("602160701770956818");
        const claimLogs = client.channels.get("601978463162990622");
        switch (args[0].toLowerCase()) {
            case "add":
                //| Add a shift to database
                //| !shift add dt 26 04:00pm 8:00pm
                if (!args[1]) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Shift Position", [
                    ["Proper Usage: ", "!shift add dt 7 4:00pm 8:00pm"]
                ]);
                if (!args[2]) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Date", [
                    ["Proper Usage: ", "!shift add dt 7 4:00pm 8:00pm"]
                ]);
                if (!args[3]) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Start Time", [
                    ["Proper Usage: ", "!shift add dt 7 4:00pm 8:00pm"]
                ]);
                if (!args[4]) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** End Time", [
                    ["Proper Usage: ", "!shift add dt 7 4:00pm 8:00pm"]
                ]);

                args[1] = args[1].toLowerCase();

                if (args[1] === "fh") {
                    args[1] = "f/h";
                }

                if (!positions.includes(args[1])) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Shift Position\n", [
                    ["Available Types: ", positions.join(", ")],
                    ["Proper Usage: ", "!shift add dt 7 4:00pm 8:00pm"]
                ]);

                if (args[2] < 1 || args[2] > 31) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Date", [
                    ["Proper Usage: ", "!shift add dt 7 4:00pm 8:00pm"]
                ]);

                if (args[3].charAt(0) !== 0 && args[3].length < 7) {
                    args[3] = "0" + args[3]
                }

                if (args[4].charAt(0) !== 0 && args[4].length < 7) {
                    args[4] = "0" + args[4]
                }

                if (timeRegex.test(args[3]) === false) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Start Time", [
                    ["Proper Usage: ", "!shift add dt 7 4:00pm 8:00pm"]
                ]);
                if (timeRegex.test(args[4]) === false) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** End Time", [
                    ["Proper Usage: ", "!shift add dt 7 4:00pm 8:00pm"]
                ]);

                args[2] = ('0' + args[2]).slice(-2);

                let postedShift = await client.database.findOne({
                    where: {
                        poster: message.author.id,
                        date: args[2],
                        startTime: args[3],
                    }
                });

                if (postedShift) {
                    if (postedShift.claimer !== null) return client.functions.sendEmbed(Discord, client, message, false, {}, false, `**Error:** This Shift is already claimed by ${client.users.get(postShift.claimer).toString()}.`);
                };
                if (postedShift) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Error:** You already have a shift posted for that date.");

                await client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Success:** Your shift has been added.", [
                    ["Shift Information", `${message.author.toString()} - ${args[1]}: ${args[2]} | ${args[3]}-${args[4]}`]
                ]);

                client.functions.sendEmbed(Discord, client, message, true, shiftChannel, "Available Shift", `**Information:**\nDate: ${args[2]}\nPosition: ${args[1]}\nStart Time: ${args[3]}\nEnd Time: ${args[4]}\nPosted By: ${message.author.toString()}`).then(sent => {
                    let fuckingMessageID = sent.id
                    client.database.create({
                        "messageID": fuckingMessageID,
                        "poster": message.author.id,
                        "position": args[1],
                        "date": args[2],
                        "startTime": args[3],
                        "endTime": args[4],
                        "claimer": null
                    });
                })

                break;
            case "delete":
                //| Delete existing shift in database
                //| !shift delete dt 20
                if (!positions.includes(args[1])) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Shift Position\n", [
                    ["Available Types: ", positions.join(", ")],
                    ["Proper Usage: ", "!shift delete dt 7"]
                ]);

                args[1] = args[1].toLowerCase();

                if (args[1] === "fh") {
                    args[1] = "f/h";
                }

                if (args[2] < 1 || args[2] > 31) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Date", [
                    ["Proper Usage: ", "!shift delete dt 7"]
                ]);

                args[2] = ('0' + args[2]).slice(-2);

                let postedShiftDelete = await client.database.findOne({
                    where: {
                        poster: message.author.id,
                        date: args[2],
                        position: args[1],
                    }
                });

                if (postedShiftDelete) {
                    if (postedShiftDelete.claimer !== null) return client.functions.sendEmbed(Discord, client, message, false, {}, false, `**Error:** This Shift is already claimed by ${client.users.get(postedShiftDelete.claimer).toString()}.`);

                    shiftChannel.messages.get(postedShiftDelete.messageID).delete();

                    client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Success:** Your shift has been removed.", [
                        ["Shift Information", `${message.author.toString()} - ${args[1]}: ${args[2]} > ${postedShiftDelete.startTime}-${postedShiftDelete.endTime}`]
                    ]);

                    await client.database.destroy({
                        where: {
                            poster: message.author.id,
                            date: args[2],
                            position: args[1],
                        }
                    });
                };

                break;

            case "claim":
                //| Claim a shift in database
                //| !shift claim @McBot#7516 dt 7
                if (!positions.includes(args[2])) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Shift Position\n", [
                    ["Available Types: ", positions.join(", ")],
                    ["Proper Usage: ", "!shift claim @McBot#7516 dt 7"],
                    ["Note: ", "A Person's User Tag and Nickname are different things."]
                ]);

                args[2] = args[2].toLowerCase();

                if (args[2] === "fh") {
                    args[2] = "f/h";
                }


                if (args[3] < 1 || args[3] > 31) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Date", [
                    ["Proper Usage: ", "!shift claim @McBot#7516 dt 7"],
                    ["Note: ", "A Person's User Tag and Nickname are different things."]
                ]);

                args[3] = ('0' + args[3]).slice(-2);

                if (!message.mentions.members.first()) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Username", [
                    ["Proper Usage: ", "!shift claim @McBot#7516 dt 7"],
                    ["Note: ", "A Person's User Tag and Nickname are different things."]
                ]);

                let postedShiftsClaim = await client.database.findOne({
                    where: {
                        poster: message.mentions.members.first().id,
                        date: args[3],
                        position: args[2]
                    }
                })

                if (!postedShiftsClaim) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Error:** Requeseted Shift Doesn't Exist.");

                if (postedShiftsClaim.claimer !== null) return client.functions.sendEmbed(Discord, client, message, false, {}, false, `**Error:** This Shift is already claimed by ${client.users.get(postedShiftClaimer.claimer).toString()}.`);

                if (message.author.id === postedShiftsClaim.poster) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Error:** You can't claim your own shift.\nUse `!shift delete` to remove your shift.");

                let claimedMessage = await client.functions.sendEmbed(Discord, client, message, true, claimedChannel, "Claimed Shift", `**Information:**\nDate: ${args[3]}\nPosition: ${args[2]}\nStart Time: ${postedShiftsClaim.startTime}\nEnd Time: ${postedShiftsClaim.endTime}\nPosted By: ${client.users.get(postedShiftsClaim.poster).toString()}\nClaimed by: ${message.member.toString()}`);

                client.users.get(postedShiftsClaim.poster).send(`One of your shifts has been claimed!\`\`\`Date: ${args[3]}\nPosition: ${args[2]}\nStart Time: ${postedShiftsClaim.startTime}\nEnd Time: ${postedShiftsClaim.endTime}\nClaimed by: ${message.member.displayName}\`\`\``);

                client.functions.sendEmbed(Discord, client, message, false, {}, false, `**Success:** ${message.member.toString()} has claimed ${client.users.get(postedShiftsClaim.poster).toString()}'s shift!`, [
                    ["Shift Information", `Date: ${args[3]}\nPosition: ${args[2]}\nStart Time: ${postedShiftsClaim.startTime}\nEnd Time: ${postedShiftsClaim.endTime}`]
                ]);
                shiftChannel.messages.get(postedShiftsClaim.messageID).delete();
                postedShiftsClaim.update({
                    claimer: message.author.id,
                    messageID: claimedMessage.id
                }, {
                    where: {
                        poster: message.mentions.members.first().id,
                        date: args[3],
                        position: args[2]
                    }
                })

                client.functions.sendEmbed(Discord, client, message, true, claimLogs, "A Shift Was Claimed!", `${message.member.toString()} has claimed ${client.users.get(postedShiftsClaim.poster).toString()}'s shift!`, [
                    ["Shift Information", `Date: ${args[3]}\nPosition: ${args[2]}\nStart Time: ${postedShiftsClaim.startTime}\nEnd Time: ${postedShiftsClaim.endTime}`]
                ])
                break;

            case "release":
                //| Release a claimed shift in database || <position>, <date>, <time>
                //| !shift release @McBot#7516 dt 7
                if (!positions.includes(args[2])) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Shift Position\n", [
                    ["Available Types: ", positions.join(", ")],
                    ["Proper Usage: ", "!shift release @McBot#7516 dt 7"],
                    ["Note: ", "A Person's User Tag and Nickname are different things."]
                ]);

                args[2] = args[2].toLowerCase();

                if (args[2] === "fh") {
                    args[2] = "f/h";
                }


                if (args[3] < 1 || args[3] > 31) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Date", [
                    ["Proper Usage: ", "!shift release @McBot#7516 dt 7"],
                    ["Note: ", "A Person's User Tag and Nickname are different things."]
                ]);

                args[3] = ('0' + args[3]).slice(-2);

                if (!message.mentions.members.first()) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Username", [
                    ["Proper Usage: ", "!shift release @McBot#7516 dt 7"],
                    ["Note: ", "A Person's User Tag and Nickname are different things."]
                ]);

                let postedShiftsRelease = await client.database.findOne({
                    where: {
                        poster: message.mentions.members.first().id,
                        date: args[3],
                        position: args[2]
                    }
                })

                if(!postedShiftsRelease) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Error:** Shift Doesn't Exist"); //? NO SHIFT

                if (postedShiftsRelease.claimer !== message.author.id) return client.functions.sendEmbed(Discord, client, message, false, {}, false, `**Error:** This shift hasn't been claimed by you. Claimed by: ${client.users.get(postedShiftsRelease.claimer).toString()}`); //? YOU HAVE NOT CLAIMED THIS SHIFT IT IS CLAIMED BY ___

                client.users.get(postedShiftsRelease.poster).send(`One of your shifts has been Released!\`\`\`Date: ${args[3]}\nPosition: ${args[2]}\nStart Time: ${postedShiftsRelease.startTime}\nEnd Time: ${postedShiftsRelease.endTime}\nReleased by: ${message.member.displayName}\`\`\``);

                client.functions.sendEmbed(Discord, client, message, false, {}, false, `**Success:** ${message.member.toString()} has released ${client.users.get(postedShiftsRelease.poster).toString()}'s shift!`, [
                    ["Shift Information", `Date: ${args[3]}\nPosition: ${args[2]}\nStart Time: ${postedShiftsRelease.startTime}\nEnd Time: ${postedShiftsRelease.endTime}`]
                ]);

                claimedChannel.messages.get(postedShiftsRelease.messageID).delete();

                client.functions.sendEmbed(Discord, client, message, true, shiftChannel, "Available Shift", `**Information:**\nDate: ${args[3]}\nPosition: ${args[2]}\nStart Time: ${postedShiftsRelease.startTime}\nEnd Time: ${postedShiftsRelease.endTime}\nPosted By: ${client.users.get(postedShiftsRelease.poster).toString()}`).then(sent => {
                    let fuckingMessageID = sent.id
                    postedShiftsRelease.update({
                        claimer: null,
                        messageID: fuckingMessageID
                    }, {
                        where: {
                            poster: message.mentions.members.first().id,
                            date: args[3],
                            position: args[2]
                        }
                    })
                })
                client.functions.sendEmbed(Discord, client, message, true, claimLogs, "A Shift Was Released!", `${message.member.toString()} has released ${client.users.get(postedShiftsRelease.poster).toString()}'s shift!`, [
                    ["Shift Information", `Date: ${args[3]}\nPosition: ${args[2]}\nStart Time: ${postedShiftsRelease.startTime}\nEnd Time: ${postedShiftsRelease.endTime}`]
                ])
                break;
            case "find":
                //| Find all shifts in database belonging to Position || <position>
                //| !shift find dt
                if (!args[1]) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Shift Position", [
                    ["Proper Usage: ", "!shift find dt"]
                ]);

                args[1] = args[1].toLowerCase();

                if (args[1] === "fh") {
                    args[1] = "f/h";
                }

                if (!positions.includes(args[1])) return client.functions.sendEmbed(Discord, client, message, false, {}, false, "**Invalid Paramater:** Shift Position", [
                    ["Available Types: ", positions.join(", ")],
                    ["Proper Usage: ", "!shift find dt"]
                ]);

                client.database.findAll({
                    where: {
                        position: args[1],
                        claimer: null
                    }
                }).then(projects => {

                    if (projects.length === 0) return client.functions.sendEmbed(Discord, client, message, false, {}, false, `**Error:** No ${args[1].toUpperCase()} Shifts Found.`);

                    let shifts = "";

                    projects.forEach(shift => {
                        shifts += `\`\`\`Date: ${shift.date}\nPosition: ${shift.position}\nStart Time: ${shift.startTime}\nEnd Time: ${shift.endTime}\nPoster: ${client.guilds.get("601937513069805568").members.get(shift.poster).displayName}\`\`\``
                    });

                    client.functions.sendEmbed(Discord, client, message, false, {}, `${args[1].toUpperCase()} Shifts:`, shifts);
                });

                break;

            default:
                break;
        }
    }
}