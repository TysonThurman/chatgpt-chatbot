import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main(){
    console.log(colors.green.bold("Welcome to the Chat Bot!\n"));

    const firstName = readlineSync.question(colors.bold.red("Can we please start with your first name?: "));
    console.log(" ");
    console.log(`Welcome to the Chat ${firstName}! You can now begin the conversation.\n`);

    const chatHistory = []; //store conversation history here until we move to a database.

    //create a database to store chatHistory:


    while(true){
        const userInput = readlineSync.question(colors.yellow(`${firstName}: `));

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

            if(userInput.toLowerCase() === 'exit' | 'bye' | 'quit'){
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