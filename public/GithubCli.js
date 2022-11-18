import GithubCliFunc from "./GithubCliFunc.js";
export default class GithubCli {
    constructor() {
        this.UserToken = "";
        this.UserName = "";
        this.LoggedIn = false;
        this.MainUrl = "https://api.github.com/";
        // getting all the functions
        this.Functions = new GithubCliFunc;
        // setting the functions in a map
        this.FunctionsMap = {};
        this.Welcome = this.Functions.Welcome;
    }
}
