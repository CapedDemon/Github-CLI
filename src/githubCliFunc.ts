import gradient from "gradient-string";
import figlet from "figlet";
import * as fs from "fs";
import chalk from "../node_modules/chalk/source/index";

export default class GithubCliFunc {

    // timeout function
    TimeoutFunc = (millisec: number) => {
        new Promise((r) => setTimeout(r, millisec));
    }

    // function to load the information about the program
    GetInfo = () => {
        let information = fs.readFileSync("package.json", "utf8");
        return JSON.parse(information);
    }

    // showing our logo
    ShowLogo = async () => {
        const Logo = chalk.green(`\t\t      \n\t\t      \n\t\t  GC  \t`);
        console.log(Logo);
    }

    // the welcome function
    Welcome = async () => {
        let Info = this.GetInfo();

        var Title: string;
        Title = `\t\tThe ${Info["name"]}\n` 

        // showing the Title
        figlet(Title, (err, data) => {
            console.log(gradient.pastel.multiline(data));
        });
        // this.ShowLogo();
        this.TimeoutFunc(1000);
    }
}