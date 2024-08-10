import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main(){
    console.log(colors.green.bold("Welcome to the Chat Bot!"));
    console.log(colors.bold.green("You can start chatting with the bot"));

    const chatHistory = []; //store conversation history

    while(true){
        const userInput = readlineSync.question(colors.yellow('You: '));

        try {
            //construct messages by iterating over the chat history
            const messages = chatHistory.map(([role, content]) => ({role, content}));

            //Add latest user input
            messages.push({role: 'user', content: userInput});

            //Call the API with the user input
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
            })

            //Get completion text/content
            const completionText = completion.choices[0].message.content;

            if(userInput.toLowerCase() === 'exit'){
                console.log(colors.green(`Bot:`) + completionText);
                return;
                //break;
            }

            console.log(colors.green(`Bot:`) + completionText);

            //Update history with user input and assistant response
            chatHistory.push(['user', userInput]);
            chatHistory.push(['assistant', completionText]);


        } catch (error) {
            console.error(console.red(error));
        }

    }
}

main();