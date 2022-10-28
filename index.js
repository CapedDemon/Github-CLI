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
import fetch from "node-fetch";
import Table from "cli-table";
import got from "got";
import terminalImage from "terminal-image";

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
    await this.timeoutFunc(1000);
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
  theSpinner = async (time, check, msg = "") => {
    const spinner = createSpinner("...").start();
    await this.timeoutFunc(time);
    if (check) {
      spinner.error({ text: `${msg}` });
    }
    spinner.stop();
  };

  // function to fetch some url
  fetchFunc = async (url) => {
    const response = await fetch(url)
      .then((res) => res.json())
      .catch((e) => {
        console.error({
          message: "oh shit",
          Error: e,
        });
      });

    return response;
  };

  // load the functions
  loadFunc = async () => {
    this.functionMap["help"] = this.help;
    this.functionMap["about"] = this.about;
    this.functionMap["userinfo"] = this.userinfo;
    this.functionMap["moreuserinfo"] = this.showMoreUserInfo;
  };

  // function assigning function
  // it uses the functionMap object
  assignFunction = async (command) => {
    var decision = 0;
    for (const i in this.functionMap) {
      if (i == command) {
        await this.functionMap[command]();
        decision = 0;
        break;
      }
      else if (i != command)
      {
        decision = 1;
      }
    }
    if (decision) {console.log(`\t${chalk.bgRed.bold("Not a command. Type help ")}`)}
  };

  // all the functions
  // the help function guiding the user
  // by telling about all the function
  help = () => {
    for (const i in this.functionMap) {
      console.log(`\t${chalk.bold.underline.blueBright(
        `${i}`
      )}`);
    }
  };

  // about
  about = () => {
    var info = this.getInfo();
    console.log(
      `\t${chalk.bgGreen.bold(`${info["name"]}`)}\n\n\t${chalk.gray(
        `version:\t`
      )}${info["version"]}\n\t${chalk.gray(`about:\t`)}${
        info["description"]
      }\n\t${chalk.gray(`author:\t`)}${info["author"]}\n\t${chalk.gray(
        `github:\t`
      )}${info["homepage"]}\n`
    );
  };

  // get information about a
  // particular user
  userinfo = async () => {
    const prompts = [
      {
        type: "input",
        name: "username",
        message: "Enter name of the user: ",
      },
    ];
    const { username, ...answers } = await inquirer.prompt(prompts);

    // making the url
    let url = this.mainUrl + "users/" + username;

    // fetching data
    const response = await this.fetchFunc(url);

    // things that are not to be shown
    // in the table.
    let notTobeShown = [
      "node_id",
      "gravatar_id",
      "url",
      "followers_url",
      "following_url",
      "gists_url",
      "starred_url",
      "events_url",
      "site_admin",
      "email",
      "hireable",
      "blog",
      "avatar_url", //special case
    ];

    // creating the table
    var table = new Table({
      head: ["Topics", "Informations"],
      colWidths: [50, 80],
    });

    // pusing in the table
    for (const key in response) {
      if (key == "avatar_url") {
        // for image
        const body = await got(response[key]).buffer();
        table.push([
          `${chalk.cyan.bold(`${key}`)}`,
          await terminalImage.buffer(body, {
            width: "50%",
            height: "50%",
          }),
        ]);
      }

      // show rest
      else if (!notTobeShown.includes(key)) {
        table.push([
          `${chalk.cyan.bold(`${key}`)}`,
          `${chalk.green(`${response[key]}`)}`,
        ]);
      }
    }

    // show the table
    console.log(table.toString());
  };

  // showing repos and followers of an user
  showMoreUserInfo = async () => {
    const prompts = [
      {
        type: "input",
        name: "username",
        message: "Enter name of the user: ",
      },
    ];
    const { username } = await inquirer.prompt(prompts);

    // making the url
    let url = this.mainUrl + "users/" + username;

    const whatToshow = [
      {
        type: "input",
        name: "topic",
        message: "what to show (repos/followers)? ",
      },
    ];
    const { topic } = await inquirer.prompt(whatToshow);
    if (topic == "repos") {
      await this.theSpinner(100, false);

      let finalurl = url + "/repos";
      const response = await this.fetchFunc(finalurl);

      //printing the repo name and its url
      // console.log(response)
      for (const i of response) {
        console.log(
          `\t${chalk.yellow(`name:\t`)}${chalk.greenBright(`${i["name"]}`)}`
        );
        console.log(
          `\t${chalk.yellow(`description:\t`)}${chalk.greenBright(
            `${i["description"]}`
          )}`
        );
        console.log(
          `\t${chalk.yellow(`url:\t`)}${chalk.greenBright(
            `${i["html_url"]}`
          )}\n`
        );
      }
    } else if (topic == "followers") {
      await this.theSpinner(100, false);

      let finalurl = url + "/followers"
      const response = await this.fetchFunc(finalurl);

      //printing the name of the followers and link to the github repo
      for (const i of response)
      {
        console.log(`\t${chalk.cyan("login:-----------")}${i["login"]}`);
        console.log(`\t${chalk.cyan("html_url:--------")}${i["html_url"]}\n`);
      };

    } else {
      await this.theSpinner(100, true, "What to show?");
    }
  };

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

    await this.theSpinner(290, false);
    if (command != "quit") {
      await this.assignFunction(command);
    } else if (command == "quit") {
      return this.ending();
    } 

    return this.takeCommand();
  };

  // the main work
  // calling the taking command function
  theWork = async () => {
    await this.loadFunc();
    await this.takeCommand();
  };
}

let user = new GithubCLI();
await user.welcome();
user.theWork();
