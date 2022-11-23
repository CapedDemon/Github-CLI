import GithubCliFunc from "./GithubCliFunc.js";
import chalk from "chalk";
import inquirer from "inquirer";

export default class GithubCli {
    private UserToken: string = "";
    public UserName: string = "";
    private LoggedIn: boolean = false;
    public MainUrl: string = "https://api.github.com/";

    // getting all the functions
    private Functions = new GithubCliFunc;

    //  functions in a object
    private FunctionsMap:any ={};
    
    
    // help functions
    // this function is assigned here so that it can take 
    // the values from the function map object
    Help = () => {
        for (const key in this.FunctionsMap) {
            console.log(`\t${chalk.bold.underline.blueBright(`${key}`)}`);
        };
    };
    
    // loading the functions
    LoadFunc =async () => {
        this.FunctionsMap["about"] = this.Functions.AboutUs;
    }
    
    
    // calling the necessary functions here
    Welcome = this.Functions.Welcome;
    Ending = this.Functions.Ending;
    TheSpinner= this.Functions.TheSpinner;
    TimeoutFunc = this.Functions.TimeoutFunc;
    GetInfo = this.Functions.GetInfo;
    FetchFunc =  this.Functions.FetchFunc;


    // it is used to assign the command it's task
    // uses the object
    AssignFunc =async (command:string) => {
        var Decision:number = 0;
        
        for (const key in this.FunctionsMap)
        {
            if (key == command)
            {
                await this.FunctionsMap[command]();
                Decision = 0;
                break;
            }
            else if (key != command)
            {
                Decision = 1;
            }
        }

        if (Decision) 
        {
            console.log(`\t${chalk.bgRed.bold("Not a command. Type help ")}`);
        }
    }

    // take command function - used to take command from the user
    TakeCommand = async() => {
        const prompts = [
            {
                type: "input",
                name: "command",
                message: "github-cli: ",
            },
        ];

        const {command, ...answers} = await inquirer.prompt(prompts);
        
        await this.TheSpinner(290);
        if (command != "quit") {
            await this.AssignFunc(command);

        } else if (command == "quit")
        {
            var end=  this.Ending();
            return;
        }
        var again = this.TakeCommand();
    }

    // Main work function
    // this will call the takecommand functions
    // as well as loading function command
    TheWork =async () => {
        await this.LoadFunc();
        await this.TakeCommand();   
    }
}