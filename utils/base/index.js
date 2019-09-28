"use strict";

const fs = require("fs");
const chalk = require("chalk");
const errorLog = chalk.bold.red;
/**
 * The master to all McBot utils
 */
class McBot {
    constructor() {

    }

    /**
     * Used to split text into an array for split sending
     * @param {string} message The full content of message
     * @param {string} char String where to split the message if the message is too long
     * @returns {array} Array with message after split
     */
    splitText(message, char = "\n") {
        let maxLength = 2000,
            prepend = "",
            append = "";
        let text = message;
        if (text.length <= maxLength) return [text];
        const splitText = text.split(char);
        if (splitText.some(chunk => chunk.length > maxLength)) throw new RangeError("SPLIT_MAX_LEN");
        const messages = [];
        let msg = "";
        for (const chunk of splitText) {
            if (msg && (msg + char + chunk + append).length > maxLength) {
                messages.push(msg + append);
                msg = prepend;
            }
            msg += (msg && msg != prepend ? char : "") + chunk;
        }
        return messages.concat(msg).filter(m => m);
    }

    /**
     * Used to load/reload all external files
     * @param {Object} client Discord.js client
     * @param {Object} Discord Discord.js
     */
    loadExternalFiles(client, Discord) {
        
        // * SETUP COMMANDS FUNCTIONS
        client.commands = new Discord.Collection();
        let commandsFolder = fs.readdirSync("./commands/");
        for (const command of commandsFolder) {
            const commandCmd = require(`../../commands/${command}`);
            client.commands.set(commandCmd.name, commandCmd);
        }

        // * SETUP BASIC FUNCTIONS
        client.functions = new Discord.Collection();
        let functions = fs.readdirSync("./functions/");
        for (const gFunction of functions) {
            const generalFunc = require(`../../functions/${gFunction}`);
            let funcName = gFunction.replace(".js", "");
            client.functions[funcName] = generalFunc;
        }
    }

    /**
     * Set activity to client
     * @param {Object} client Discord.js client
     * @param {String} activityType * **PLAYING**, **LISTENING**, **WATCHING**
     * @param {string} activity Status
     */
    setActivity(client, activityType = "PLAYING", activity = "With A Happy Meal") {
        client.user.setPresence({
            activity: {
                type: activityType,
                name: activity,
            },
        });
    }

    /**
     * @returns {String} generated Error ID
     */
    async makeErrorId() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 7; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * @param {Error} err Caught error
     * @param {Object} client Discord.js client
     */
    async dealWithError(err, client) {
        let errTemp = err.toString();
        if (errTemp.includes("Error: listen EADDRINUSE 0.0.0.0:") || errTemp.includes("DiscordAPIError: Missing Permissions")) { } else { //eslint-disable-line no-empty
            if (client.config.showFullErrors == 1) return console.error(err);
            if (client.config.showErrors == 1) console.error(errorLog(err));
            let i = 0;
            let errorId = "";
            do {
                errorId = await this.makeErrorId();
                if (!fs.existsSync(`../logs/${errorId}.json`)) {
                    i = 1;
                }
            } while (i == 0);
            let content = {
                "time": Date.now(),
                "message": err.message,
                "stack": err.stack,
            };
            fs.writeFile(`./logs/${errorId}.json`, JSON.stringify(content), (errored) => {
                if (errored) return console.error(errorLog(`Failed to save error ID: ${errorId}`));

                console.error(errorLog(`Saved full error with ID: ${errorId}`));
            });
        }
    }

    /**
     * 
     * @param {Objact} client Discord.js client
     * @param {Object} Discord Discord.js
     */
    reloadExternalFiles(client, Discord) {
        // * SETUP COMMANDS FUNCTIONS
        client.commands = new Discord.Collection();
        let commandsFolder = fs.readdirSync("./commands/");
        for (const command of commandsFolder) {
            delete require.cache[require.resolve(`../../commands/${command}`)];
            const commandCmd = require(`../../commands/${command}`);
            client.commands.set(commandCmd.name, commandCmd);
        }
        // * SETUP BASIC FUNCTIONS
        client.functions = new Discord.Collection();
        let functions = fs.readdirSync("./functions/");
        for (const gFunction of functions) {
            delete require.cache[require.resolve(`../../functions/${gFunction}`)];
            const generalFunc = require(`../../functions/${gFunction}`);
            let funcName = gFunction.replace(".js", "");
            client.functions[funcName] = generalFunc;
        }
    }
}
module.exports = McBot;