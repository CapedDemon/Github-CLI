#!/usr/bin/env node

// importing libraries
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import * as fs from "fs";
import * as path from "path";
import { createSpinner } from "nanospinner";
import { syncBuiltinESMExports } from "module";

class GithubCLI {
  // important variables
  mainUrl = "https://api.github.com/";
  functionMap = {};

  // timeout function which takes
  // milliseconds according to requirement
  timeoutFunc = (milliseconds) =>
    new Promise((r) => setTimeout(r, milliseconds));

  // function to load necessary info
  getInfo = () => {
    let information = fs.readFileSync("package.json");
    return JSON.parse(information);
  };

  // the welcome
  welcome = async () => {
    let info = this.getInfo(); // fetching information
    const msg = `\t\tThe ${info["name"]}\n`;
    figlet(msg, (err, data) => {
      console.log(gradient.pastel.multiline(data));
    });
    await this.timeoutFunc(1000)
  };

  // ending script
  ending = async () => {
    const endStatement = chalkAnimation.rainbow(
      `\t\tThank you for using Github-CLI.\n\t\tSee you again next time\n`
    );
    await this.timeoutFunc(2000);
    endStatement.stop();
  };

  // the loader
  theSpinner = async (time) => {
    const spinner = createSpinner("...").start();
    await this.timeoutFunc(time);
    spinner.stop();
  };

  // load the functions
  loadFunc = () => {
    this.functionMap["help"] = this.help;
    this.functionMap["about"] = this.about;
  }

  // function assigning function
  // it uses the functionMap object
  assignFunction = (command) => {
    this.functionMap[command]();
  }

  // all the functions
  // the help function guiding the user
  // by telling about all the function
  help = function () {
    const list = `\t${chalk.bold.underline.blueBright(`about\n\tuserinfo`)}\n`
    console.log(list);
  };

  // about
  about = () => {
    var info = this.getInfo();
    console.log(`\t${chalk.bgGreen.bold(`${info["name"]}`)}\n\n\t${chalk.gray(`version:\t`)}${info["version"]}\n\t${chalk.gray(`about:\t`)}${info["description"]}\n\t${chalk.gray(`author:\t`)}${info["author"]}\n\t${chalk.gray(`github:\t`)}${info["homepage"]}\n`);
  }

  // taking commands -
  takeCommand = async () => {
    const prompts = [
      {
        type: "input",
        name: "command",
        message: "github-cli: ",
      },
    ];

    const { command, ...answers } = await inquirer.prompt(prompts);

    await this.theSpinner(290);
    if (command != "quit") {
      this.assignFunction(command);
    }
    else if (command == "quit")
    {
      return this.ending();
    }
    

    return this.takeCommand();
  };

  theWork = async () => {
    this.loadFunc();
    await this.takeCommand();
  };

}

let user = new GithubCLI();
await user.welcome();
user.theWork();