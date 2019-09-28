//* Start | Setup Package Requires
const Discord = require("discord.js"); //? Require Discord
const client = new Discord.Client(); //? Setup CLient

const McBot = require("./utils"); //? Require Custom McBot Utils
const mcBotUtils = new McBot //? Setup McBot Util

const config = require("./config/config.json"); //? Require Config
config.roles = require("./config/roles.json"); //? Require Role ID's

const randomMessages = [{
        activity: "PLAYING",
        name: "With A Happy Meal Toy"
    },
    {
        activity: "LISTENING",
        name: "A Timer Beep"
    },
    {
        activity: "WATCHING",
        name: "Managers on Their Phones"
    },
    {
        activity: "LISTENING",
        name: "Customers Complaining"
    },
    {
        activity: "WATCHING",
        name: "The Fry Timer Count Down"
    },
    {
        activity: "PLAYING",
        name: "With Happy Meal Boxes"
    },
    {
        activity: "PLAYING",
        name: "In The Shed"
    },
    {
        activity: "PLAYING",
        name: "In The Cage"
    },
    {
        activity: "LISTENING",
        name: "The Fan in the Freezer"
    },
    {
        activity: "WATCHING",
        name: "Customers Rage at Kiosk"
    },
    {
        activity: "WATCHING",
        name: "The News on the TV"
    },
    {
        activity: "LISTENING",
        name: "The Music in Lobby"
    },
    {
        activity: "PLAYING",
        name: "With the Female Hand Dryer"
    },
    {
        activity: "WATCHING",
        name: "Cars in the Drive Thru"
    }
]

config.randomMessages = randomMessages


const Sequelize = require("sequelize"); //? Require Sequelize

const schedule = require("node-schedule");

//* End | Setup Package Requires

//todo Add More Packages If Required

//* Start | Setup Database Connection
const database = new Sequelize("database", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    // * SQLite only
    storage: "./database/shifts.sqlite",
});

client.database = database.define("shifts", {
    "messageID": Sequelize.TEXT,
    "poster": Sequelize.TEXT,
    "position": Sequelize.TEXT,
    "date": Sequelize.TEXT,
    "startTime": Sequelize.TEXT,
    "endTime": Sequelize.TEXT,
    "claimer": Sequelize.TEXT
});
//* End | Setup Database Connection

//* Start | Setup Extentions
mcBotUtils.loadExternalFiles(client, Discord); //? Load Commands & Functions

client.mcBotUtils = mcBotUtils; //? Add McBot To Client
client.config = config //? Add McBot To CLient

var purgeOldShifts = new schedule.RecurrenceRule();
purgeOldShifts.dayOfWeek = [new schedule.Range(0, 6)]
purgeOldShifts.hour = 10;
purgeOldShifts.minute = 0;

var purgeOldShiftsFunction = schedule.scheduleJob(purgeOldShifts, function () {
    let yesterday = parseInt(new Date().getDate()) - 1;
    client.database.findAll({
        where: {
            date: yesterday
        }
    }).then(project => {
        project.forEach(shift => {
            if (shift.claimer !== null) {
                client.channels.get("602160701770956818").messages.get(shift.messageID).delete();

            } else {
                client.channels.get("601957622106554368").messages.get(shift.messageID).delete();
            }
            client.database.destroy({
                where: {
                    messageID: shift.messageID
                }
            })
        });
    })

})
//* End | Setup Client

setInterval(() => {
    let randomNumber = Math.floor(Math.random() * client.config.randomMessages.length)
    let activity = client.config.randomMessages[randomNumber]
    client.mcBotUtils.setActivity(client, activity.activity, activity.name);
}, 1800000);

//! Client | Ready
client.on("ready", () => {
    console.log("Started McBot!\nReady to flip some burgers!"); //? Log To Console When Ready

    let randomNumber = Math.floor(Math.random() * client.config.randomMessages.length)
    let activity = client.config.randomMessages[randomNumber]
    mcBotUtils.setActivity(client, activity.activity, activity.name); //? Set Clients Activity

    client.database.sync();

    const shiftChannel = client.channels.get("601957622106554368").messages.fetch()
    const claimedChannel = client.channels.get("602160701770956818").messages.fetch()
});

//! CLient | Message

client.on("message", message => {
    if (message.author.bot) return; //? Return If Message Is By A Bot
    if (message.channel.type == "dm") return; //? Return If Message Is In DM's
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|\\${client.config.prefix})\\s*`); //?Regex Check For Prefix Or Bot Tag
    if (!prefixRegex.test(message.content)) return; //? Run Regex Check
    const [, matchedPrefix] = message.content.match(prefixRegex); //? Get Matched Prefix (Yes the , Is Needed)
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/); //? Get Arguments From Message
    const commandName = args.shift().toLowerCase(); //? Get Command From Arguments
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); //? Fetch Command
    if (!command) return; //? Return If No Command Found
    if (command.requiredRole) { //? Check If Command Requires A Role To Run
        //*| Command Requires A Role To Run
        let roleName = command.requiredRole; //? Get Role Name Set In Command
        let roleId = client.config.roles[roleName] //? Get Role ID From roles.json
        if (message.member.roles.has(client.config.roles.developer)) { //? Check IF Member Is A Developer (Bypasses Role Requirements)
            command.run(Discord, client, message, args) //? Run Command
        } else {

            if (message.member.roles.has(roleId)) { //? Check If Member Has The Role Reqired
                command.run(Discord, client, message, args) //? Run Command
            }
        }
    } else {
        //*| Command Has No Required Role
        command.run(Discord, client, message, args) //? Run command
    }
})





//* Start | Error Handling
process.on("uncaughtException", err => {
    mcBotUtils.dealWithError(err, client);
});
process.on("unhandledRejection", err => {
    mcBotUtils.dealWithError(err, client);
});

client.on("error", err => {
    mcBotUtils.dealWithError(err, client);
});
//* End | Error Handling

//! Heroku Login
client.login(process.env.BOT_TOKEN);