import GithubCliFunc from "./GithubCliFunc.js";

export default class GithubCli {
    private UserToken: string = "";
    public UserName: string = "";
    private LoggedIn: boolean = false;
    public MainUrl: string = "https://api.github.com/";

    // getting all the functions
    private Functions = new GithubCliFunc;

    // setting the functions in a map
    private FunctionsMap: object = {

    };


    Welcome  = this.Functions.Welcome;
}