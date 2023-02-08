const { Configuration, OpenAIApi } = require("openai");
const chalk = require('chalk');
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const TelegramBot = require('node-telegram-bot-api');

const token = '6004786246:AAFWl_xxMgpN2iN64WgRRdwENO2BJj8h3Cw';
const bot = new TelegramBot(token, {polling: true});
const help_messages = "\n\nБот не ответит на 100% ваших вопросов, так что если пишет что-то не красивое, то так и должно быть";


bot.on('message', (msg) => {
    if(msg.text[0] === "."){
        let prompt = msg.text.substring(1,msg.text.length);
        const chatId = msg.chat.id;
        console.log(chalk.red("Вопрос: ") + chalk.white(prompt));
        bot.sendMessage(chatId, "🤖 Ваш запрос обрабатывается ChatGPT. Это сообщение будет изменено после обработки").then((data)=>{
            openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                temperature : 0.9,
                max_tokens : 1000,
                top_p : 1.0,
                frequency_penalty : 0.0,
                presence_penalty : 0.6,
                stop : ["You:"]
              }).then((res)=>{
                console.log(chalk.green("Ответ: ") + chalk.white(res.data.choices[0].text));
                bot.editMessageText(`✅ Ответ ${res.data.choices[0].text}`,{
                  chat_id : chatId,
                  message_id : data.message_id
                })
              });
        })
        
        // openai.createImage({
        //     "prompt": prompt,
        //     "n": 2,
        //     "size": "1024x1024"
        // }).then((res)=>{
            
        //     bot.sendPhoto(chatId, res.data.data[0].url)
        // })
    }
});