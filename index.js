#!/usr/bin/env node

// importing libraries
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import * as fs from "fs";
import * as path from 'path';

class GithubCLI {
  
  // important variables
  mainUrl = "https://api.github.com/"

  // function to load necessary info
  getInfo  = function () {
    let information = fs.readFileSync("info.json");   
    return (JSON.parse(information));
  }

  // the welcome 
  welcome = async function () {
    // timeout function which takes 
    // milliseconds according to requirement
    let timeoutWelcome = (milliseconds) =>
      new Promise((r) => setTimeout(r, milliseconds));

    let info = this.getInfo()  // fetching information

    const theStatement = chalkAnimation.rainbow(`\t\tWelcome to the ${info["Info"]["Name"]}\n`)
    await timeoutWelcome(2000);
    theStatement.stop()

    const about = chalkAnimation.neon(
      `\tThe Place where you can do all the things related to github.\nGetting information about someone, pull requests, push and many more..\n\n`
    );
    await timeoutWelcome(2000);
    about.stop();
  };


  // the help function guiding the user
  // by telling about all the function
  help = function () {
    // do something
  }

}


let user = new GithubCLI();
user.welcome();

