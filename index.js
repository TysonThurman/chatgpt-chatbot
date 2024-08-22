import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv'
dotenv.config();

async function main(){
    const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_HOST}:${process.env.DB_PORT}/?authSource=admin`;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const database = client.db('chatbot');
        const collection = database.collection('chathistory');

        const cursor = collection.find({});

        await cursor.forEach(chat => {
            console.log(chat);
        });
        
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("Disconnected from MongoDB!");
    }
    
    console.log(colors.green.bold("Welcome to the Chat Bot!\n"));

    const firstName = readlineSync.question(colors.bold.red("Can we please start with your first name?: "));
    console.log(`\nWelcome to the Chat ${firstName}! You can now begin the conversation.\n`);

    const chatHistory = []; //store conversation history here until we move to the database.

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

            if(userInput.toLowerCase() === 'exit' || 'bye' || 'quit'){
                console.log(colors.green(`Bot:`) + completionText);
                return;
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
// main().catch(console.error);