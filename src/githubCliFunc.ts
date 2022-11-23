import gradient from "gradient-string";
import figlet from "figlet";
import * as fs from "fs";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import chalkAnimation from "chalk-animation";

export default class GithubCliFunc {

    // timeout function
    TimeoutFunc = (millisec: number) => {
        new Promise((r) => setTimeout(r, millisec));
    }

    // the loader function
    TheSpinner = async (time: number, check = null, msg = "") => {
        const Spinner = createSpinner("...").start();
        this.TimeoutFunc(time);
        if (check == false) {
            Spinner.error({ text: `${msg}` });
        } else if (check == true) {
            Spinner.success({ text: msg });
        } else {
            Spinner.stop();
        }
    };

    // function to load the information about the program
    GetInfo = () => {
        let information = fs.readFileSync("package.json", "utf8");
        return JSON.parse(information);
    }

    // the welcome function
    Welcome = async () => {
        let Info = this.GetInfo();


        let Title = `\t\tThe ${Info["name"]}\n`

        // showing the Title
        figlet(Title, (err, data) => {
            console.log(gradient.pastel.multiline(data));
        });
        this.TimeoutFunc(2000);
    }

    // ending script
    Ending = async () => {
        const EndStatement = chalkAnimation.rainbow(
            `\t\tThank you for using Github-CLI.\n\t\tSee you again next time\n`
        );
        this.TimeoutFunc(2000);
        EndStatement.stop();
    };

    // function to fetch information
    // from a particular url
    FetchFunc = async (url: string) => {
        const response = await fetch(url)
            .then((res) => res.json())
            .catch((err) => {
                console.error({
                    message: "oh shit!!",
                });
                return false;
            });

        if (response["message"] != "Not Found") {
            return response;
        }
        else {
            return false;
        };
    };


    //About function
    AboutUs = () => {
        let info = this.GetInfo();
        console.log(
            `\t${chalk.bgGreen.bold(`${info["name"]}`)}\n\n\t${chalk.gray(
                `version:\t`
            )}${info["version"]}\n\t${chalk.gray(`about:\t`)}${info["description"]
            }\n\t${chalk.gray(`author:\t`)}${info["author"]}\n\t${chalk.gray(
                `github:\t`
            )}${info["homepage"]}\n`
        );
    };

    

}