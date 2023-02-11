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

let tab = "main";
console.log(chalk.red("Вселенная будет уничтожена через..."))
bot.on("help",()=>{
  console.log(123);
})
function help(){
  console.log(1234)
}
let BTNS = {
  IMAGE : "🖼 Сгенерировать картинку",
  GPT : "🤖 Обращение к ИИ",
  CLOSE : "❌ Закрыть чат"
}
function buildKeyBoard(){
  let obj = null;
  if(tab == "main"){
    obj = [
      {
        text : BTNS.IMAGE
      },
      {
        text : BTNS.GPT
      }
    ]
  }
  else{
    obj = [
      {
        text : BTNS.CLOSE
      }
    ]
  }
  return [obj];
  
}
function checkAction(msg, id){
 
  if(msg == BTNS.GPT){
    tab = "gpt";
    bot.sendMessage(id,"Чат с ИИ начат, можете задавать свои вопросы",{
      reply_markup : {
        keyboard : buildKeyBoard(),
        one_time_keyboard : true
      }
    });
  }
  else if(msg == BTNS.IMAGE){
    tab = "image";
    bot.sendMessage(id,"Чат с генератором картинок начат, можете создавать запросы",{
      reply_markup : {
        keyboard : buildKeyBoard(),
        one_time_keyboard : true
      }
    });
  }
  else if(msg == BTNS.CLOSE){
    tab = "main";
    bot.sendMessage(id,"Чат закрыт",{
      reply_markup : {
        keyboard : buildKeyBoard(),
        one_time_keyboard : true
      }
    });
  }

  
}

function sendPrompt(prompt,chatId){
  if(tab == "gpt"){
    console.log(chalk.red("Вопрос: ") + chalk.white(prompt));
    bot.sendMessage(chatId, "🤖 Ваш запрос обрабатывается ChatGPT. Это сообщение будет изменено после обработки").then((data)=>{
      try {
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
      } catch (error) {
        bot.editMessageText(`📛 Произошла ошибка при выполнении запроса`,{
          chat_id : chatId,
          message_id : data.message_id
        })
      }
      
      })
  }
  else if(tab == "image"){
    console.log(chalk.red("Вопрос: ") + chalk.white(prompt));
    try{
    openai.createImage({
      "prompt": prompt,
      "n": 2,
      "size": "1024x1024"
      }).then((res)=>{
          
          bot.sendPhoto(chatId, res.data.data[0].url)
      })
    } catch (error) {
      bot.editMessageText(`📛 Произошла ошибка при выполнении запроса`,{
        chat_id : chatId,
        message_id : data.message_id
      })
    }
  }
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  if(tab == "main"){
    checkAction(msg.text, chatId);
    if(tab == "main"){
      bot.sendMessage(chatId,"🕹 Выберите действие", {
        reply_markup : {
          keyboard : buildKeyBoard(),
          one_time_keyboard : true
        }
      })
    }
  }
  else{
    checkAction(msg.text, chatId);
    if(tab != "main"){
        sendPrompt(msg.text,chatId);
    }
  }

});
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
  };
  let text;

  if (action === 'help') {
      text = 'Вы нажали первую кнопку';
     
  }
  console.log(2333);
  bot.editMessageText(text, opts);
});