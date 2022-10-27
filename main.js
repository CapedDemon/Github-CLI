import inquirer from "inquirer";

const collectInputs = async () => {
  const prompts = [
    {
      type: "input",
      name: "inputValue",
      message: "Enter some input: ",
    },
    
  ];

  const { inputValue, ...answers } = await inquirer.prompt(prompts);
  if (inputValue == "quit")
    return console.log("ok");
  else
    return collectInputs()
};

const main = async () => {
  await collectInputs();
};

main();
