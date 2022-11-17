#!/usr/bin/env node

// importing libraries
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import * as fs from "fs";
import { createSpinner } from "nanospinner";
import fetch from "node-fetch";
import Table from "cli-table";
import got from "got";
import terminalImage from "terminal-image";
import { Octokit } from "@octokit/rest";

class GithubCLI {
  // important variables
  mainUrl = "https://api.github.com/";
  functionMap = {};
  loggedin = false;
  userToken = null;
  mainusername = "";

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
  theSpinner = async (time, check = null, msg = "") => {
    const spinner = createSpinner("...").start();
    await this.timeoutFunc(time);
    if (check == false) {
      spinner.error({ text: `${msg}` });
    } else if (check == true) {
      spinner.success({ text: msg });
    } else {
      spinner.stop();
    }
  };

  // checking the response is empty or not
  responseLen = (response) => {
    if (response.length == 0) {
      return true;
    }
    return false;
  };

  // function to fetch some url
  fetchFunc = async (url) => {
    var netwrokerror = false;
    const response = await fetch(url)
      .then((res) => res.json())
      .catch((e) => {
        console.error({
          message: "oh shit",
        });
        return false;
      });
    if (response["message"] != "Not Found") {
      return response;
    } else {
      return false;
    }
  };

  // load the functions
  loadFunc = async () => {
    this.functionMap["help"] = this.help;
    this.functionMap["about"] = this.about;
    this.functionMap["userinfo"] = this.userinfo;
    this.functionMap["moreuserinfo"] = this.showMoreUserInfo;
    this.functionMap["login"] = this.loginFunc;
    this.functionMap["logout"] = this.logout;
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
      } else if (i != command) {
        decision = 1;
      }
    }
    if (decision) {
      console.log(`\t${chalk.bgRed.bold("Not a command. Type help ")}`);
    }
  };

  // all the functions
  // the help function guiding the user
  // by telling about all the function
  help = () => {
    for (const i in this.functionMap) {
      console.log(`\t${chalk.bold.underline.blueBright(`${i}`)}`);
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

    // validating the user
    if (response == false) {
      console.log(`\t${chalk.red("Error Occured")}`);
    } else {
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
    }
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

    //validating the user
    if ((await this.fetchFunc(url)) == false) {
      await this.theSpinner(100, false, `${chalk.red(`\tError Occured`)}`);
    } else {
      await this.theSpinner(100, true, `${chalk.green(`\tUser Found`)}`);

      // list of options to show
      // if user is not logged in
      let options1 = ["repositories", "followers", "organizations", "None"];

      //if user is looged in
      let options2 = [
        "repositories",
        "followers",
        "organizations",
        "following",
        "None",
      ];

      const whatToshow = [
        {
          type: "list",
          name: "topic",
          message: "what do you want to see ?\n",
        },
      ];
      if (this.loggedin) {
        whatToshow[0]["choices"] = options2;
      } else {
        whatToshow[0]["choices"] = options1;
      }

      const { topic } = await inquirer.prompt(whatToshow);
      if (topic == "repos") {
        let finalurl = url + "/repos";
        const response = await this.fetchFunc(finalurl);

        //checking response length
        if (this.responseLen(response) == false) {
          await this.theSpinner(100, false, "Do not have repos");
        } else {
          await this.theSpinner(100, true, "Repos are here-");
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
        }
      } else if (topic == "followers") {
        let finalurl = url + "/followers";
        const response = await this.fetchFunc(finalurl);

        if (this.responseLen(response) == false) {
          await this.theSpinner(100, false, "Do not have any followers");
        } else {
          await this.theSpinner(100, true, "followers are here -");
          //printing the name of the followers and link to the github repo
          for (const i of response) {
            console.log(`\t${chalk.cyan("login:-----------")}${i["login"]}`);
            console.log(
              `\t${chalk.cyan("html_url:--------")}${i["html_url"]}\n`
            );
          }
        }
      } else if (topic == "organizations") {
        let finalurl = url + "/orgs";
        const response = await this.fetchFunc(finalurl);
        if (response.length == 0) {
          await this.theSpinner(150, false, "Do not have organizations.");
        } else {
          await this.theSpinner(150, true, "organizations are here -");
          for (const i of response) {
            console.log(
              `\t${chalk.redBright(`login:----------`)}${i["login"]}`
            );
            console.log(`\t${chalk.redBright(`url:------------`)}${i["url"]}`);
            console.log(
              `\t${chalk.redBright(`description:----`)}${i["description"]}\n`
            );
          }
        }
      } else if (topic == "Later") {
        await this.theSpinner(100, false, "Mission of showing more aborted.");
      }

      // logged in functionalities
      if (this.loggedin) {
        const octokit = new Octokit({
          auth: this.userToken,
        });
        if (topic == "following") {
          const { data } = await octokit.request(
            "GET /users/{username}/following",
            {
              username: this.mainusername,
            }
          );
          console.log(data);
        }
      }
    }
  };

  // login in github
  loginFunc = async () => {
    if (!this.loggedin) {
      const prompt = [
        {
          type: "input",
          name: "token",
          message:
            "Please enter your personal token (so that we can authenticate the github activites): ",
        },
      ];
      const { token } = await inquirer.prompt(prompt);

      const prompt2 = [
        {
          type: "input",
          name: "username",
          message: "Please enter your username: ",
        },
      ];
      const { username } = await inquirer.prompt(prompt2);

      this.userToken = token;
      this.loggedin = true;
      this.mainusername = username;

      console.log(`\t${chalk.bgGreen.bold("Successfully logged in")}`);
    } else {
      console.log(`\t${chalk.green.bold("You are already logged in.")}`);
    }
  };

  // logout
  logout = async () => {
    if (this.loggedin) {
    this.loggedin = false;
    this.mainusername = "";
    this.userToken = null;
    console.log(`\t${chalk.bgRed.bold("Logged Out")}`);
    }
    else 
    {
      console.log(`\t${chalk.blue("Login first")}`);
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

    await this.theSpinner(290);
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
