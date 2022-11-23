var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import GithubCliFunc from "./GithubCliFunc.js";
import chalk from "chalk";
import inquirer from "inquirer";
export default class GithubCli {
    constructor() {
        this.UserToken = "";
        this.UserName = "";
        this.LoggedIn = false;
        this.MainUrl = "https://api.github.com/";
        // getting all the functions
        this.Functions = new GithubCliFunc;
        //  functions in a object
        this.FunctionsMap = {};
        // help functions
        // this function is assigned here so that it can take 
        // the values from the function map object
        this.Help = () => {
            for (const key in this.FunctionsMap) {
                console.log(`\t${chalk.bold.underline.blueBright(`${key}`)}`);
            }
            ;
        };
        // loading the functions
        this.LoadFunc = async () => {
            this.FunctionsMap["about"] = this.Functions.AboutUs;
        };
        // calling the necessary functions here
        this.Welcome = this.Functions.Welcome;
        this.Ending = this.Functions.Ending;
        this.TheSpinner = this.Functions.TheSpinner;
        this.TimeoutFunc = this.Functions.TimeoutFunc;
        this.GetInfo = this.Functions.GetInfo;
        this.FetchFunc = this.Functions.FetchFunc;
        // it is used to assign the command it's task
        // uses the object
        this.AssignFunc = async (command) => {
            var Decision = 0;
            for (const key in this.FunctionsMap) {
                if (key == command) {
                    await this.FunctionsMap[command]();
                    Decision = 0;
                    break;
                }
                else if (key != command) {
                    Decision = 1;
                }
            }
            if (Decision) {
                console.log(`\t${chalk.bgRed.bold("Not a command. Type help ")}`);
            }
        };
        // take command function - used to take command from the user
        this.TakeCommand = async () => {
            const prompts = [
                {
                    type: "input",
                    name: "command",
                    message: "github-cli: ",
                },
            ];
            const _a = await inquirer.prompt(prompts), { command } = _a, answers = __rest(_a, ["command"]);
            await this.TheSpinner(290);
            if (command != "quit") {
                await this.AssignFunc(command);
            }
            else if (command == "quit") {
                var end = this.Ending();
                return;
            }
            var again = this.TakeCommand();
        };
        // Main work function
        // this will call the takecommand functions
        // as well as loading function command
        this.TheWork = async () => {
            await this.LoadFunc();
            await this.TakeCommand();
        };
    }
}
