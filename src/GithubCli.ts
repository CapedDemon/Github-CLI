import GithubCliFunc from "./GithubCliFunc.js";
import chalk from "chalk";

export default class GithubCli {
    private UserToken: string = "";
    public UserName: string = "";
    private LoggedIn: boolean = false;
    public MainUrl: string = "https://api.github.com/";

    // getting all the functions
    private Functions = new GithubCliFunc;
    
    // setting the functions in a map
    private FunctionsMap: object = {};

    // help functions
    // this function is assigned here so that it can take 
    // the values from the function map object
    Help = () => {
        for (const key in this.FunctionsMap) {
            console.log(`\t${chalk.bold.underline.blueBright(`${key}`)}`);
        };
    };


    

    Welcome  = this.Functions.Welcome;

    // take command function - used to take command from the user
    TakeCommand = async() => {
        // do something
    }
}