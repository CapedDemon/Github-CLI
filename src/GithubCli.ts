#!/usr/bin/env node

// importing libraries
import chalk from "chalk";
// import inquirer from "inquirer";
// import gradient from "gradient-string";
// import chalkAnimation from "chalk-animation";
// import figlet from "figlet";
// import * as fs from "fs";
// import { createSpinner } from "nanospinner";
// import fetch from "node-fetch";
// import Table from "cli-table";
// import got from "got";
// import terminalImage from "terminal-image";
// import { Octokit } from "@octokit/rest";

import githubCliFunc from "./githubCliFunc";

class GithubCli {
    
    private readonly ApiUrl = "https://api.github.com/";
    private UserToken: string = "";
    public UserName: string = "";
    public LoggedIn: boolean = false;
    private FunctionMap: object = {};
    private Functions = new githubCliFunc;

    // declaring the functions
    TimeOut = this.Functions.TimeOut;
    Welcome  = this.Functions.Welcome;
}

export default GithubCli;