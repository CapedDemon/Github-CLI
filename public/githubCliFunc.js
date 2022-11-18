var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import gradient from "gradient-string";
import figlet from "figlet";
import * as fs from "fs";
import chalk from "chalk";
export default class GithubCliFunc {
    constructor() {
        // timeout function
        this.TimeoutFunc = (millisec) => {
            new Promise((r) => setTimeout(r, millisec));
        };
        // function to load the information about the program
        this.GetInfo = () => {
            let information = fs.readFileSync("package.json", "utf8");
            return JSON.parse(information);
        };
        // showing our logo
        this.ShowLogo = () => __awaiter(this, void 0, void 0, function* () {
            const Logo = chalk.green(`\t\t      \n\t\t      \n\t\t  GC  \t`);
            console.log(Logo);
        });
        // the welcome function
        this.Welcome = () => __awaiter(this, void 0, void 0, function* () {
            let Info = this.GetInfo();
            let Title = `\t\tThe ${Info["name"]}\n`;
            // showing the Title
            figlet(Title, (err, data) => {
                console.log(gradient.pastel.multiline(data));
            });
            this.ShowLogo();
            this.TimeoutFunc(1000);
        });
    }
}
