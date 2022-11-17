#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const githubCliFunc_1 = __importDefault(require("./githubCliFunc"));
class GithubCli {
    constructor() {
        this.ApiUrl = "https://api.github.com/";
        this.UserToken = "";
        this.UserName = "";
        this.LoggedIn = false;
        this.FunctionMap = {};
        this.Functions = new githubCliFunc_1.default;
        // declaring the functions
        this.TimeOut = this.Functions.TimeOut;
        this.Welcome = this.Functions.Welcome;
    }
}
exports.default = GithubCli;
