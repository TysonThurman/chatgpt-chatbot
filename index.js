import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main(){
    console.log(colors.green.bold("Welcome to the Chat Bot!"));
    console.log(colors.bold.green("You can start chatting with the bot"));

    while(true){
        const userInput = readlineSync.question(colors.yellow('You: '));

        try {
            //Call the API with the user input
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: userInput}],
            })

            //Get completion text/content
            const completionText = completion.choices[0].message.content;

            if(userInput.toLowerCase() === 'exit'){
                console.log(colors.green(`Bot:`) + completionText);
                return;
                //break;
            }

            console.log(colors.green(`Bot:`) + completionText);


        } catch (error) {
            console.error(console.red(error));
        }

    }
}

main();