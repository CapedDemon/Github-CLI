import figlet from "figlet";
import gradient from "gradient-string";

class githubCliFunc {

    // timout function
    TimeOut = (millisec: number) => {
        new Promise((r) => setTimeout(r, millisec));
    };

    

    // welcome function
    Welcome = async () => {
        const msg = `\t\tHello\n`;
        figlet(msg, (err, data) => {
            console.log(gradient.pastel.multiline(data));
        });
        this.TimeOut(1000);
    }
}

export default githubCliFunc;