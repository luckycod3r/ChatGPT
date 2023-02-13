// Импорты
require('./mysql')
const { Configuration, OpenAIApi } = require("openai");
const TelegramBot = require('node-telegram-bot-api');
const chalk = require('chalk');
const { Btn, buildKeyBoard, defaultReply } = require("./keyboard");
const { BTNS } = require("./buttons");
const { checkAction } = require("./console");
const { Action } = require('./actions');
const isDev = true;


// Конец импортов
const token = '6200335185:AAHbnCFeaufpGLuVETE9N3ibXQxk_J3_Cvg';
global.bot = new TelegramBot(token, {polling: true});
const configuration = new Configuration({ apiKey: "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"});
const openai = new OpenAIApi(configuration);

global.tab = "main";

global.SESSION = {}

global.startSession = (type) => {
  SESSION = {
    type : type,
    questions : "",
    user : [],
    bot : [],
    doneLast : true,
    requests : 20
  }
}
global.User = {
  isAdmin : false,
  balance : 0
}


console.log(chalk.red("Вселенная будет уничтожена через..."))



let verified = false;
function sendPrompt(prompt,chatId){
  if(User.balance < 5){
    bot.sendMessage(chatId,BTNS.ENOUGH_MONEY, defaultReply());
    tab = "main";
    return;
  }
  Action.buyItem(chatId,5);
  if(tab == "gpt"){
    SESSION.doneLast = false
    console.log(chalk.red("Вопрос: ") + chalk.white(prompt));
    bot.sendMessage(chatId, "🤖 Ваш запрос обрабатывается ChatGPT. Это сообщение будет изменено после обработки").then((data)=>{
      try {

        let FIXED_MEMORY = "";

        if(SESSION.type == "chat"){
          SESSION.user.push(prompt);
        }

        for(let i in SESSION.user){
          FIXED_MEMORY += `USER: ${SESSION.user[i]}` + "\n"
          if(SESSION.bot[i] != undefined) FIXED_MEMORY += `BOT: ${SESSION.bot[i]}` + "\n"
        }
        console.log(chalk.yellow("PROMPT: ") + FIXED_MEMORY);
        openai.createCompletion({
          model: "text-davinci-003",
          prompt: FIXED_MEMORY,
          temperature : 0,
          max_tokens : 1000,
          // top_p : 1.0,
          frequency_penalty : 0.0,
          presence_penalty : 0.6,
          stop : ["USER", "NLP-CHATBOT"]
        }).then((res)=>{
          console.log(res.data);
          console.log(chalk.green("Ответ: ") + chalk.white(res.data.choices[0].text));
          let answer = res.data.choices[0].text;
          answer = answer.replace("BOT: ", "");

          bot.editMessageText(`✅ Ответ ${answer}`,{
            chat_id : chatId,
            message_id : data.message_id
          })
          SESSION.bot.push(answer);
          SESSION.doneLast = true
        });
      } catch (error) {
        console.log(error);
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

function check(chat){
  if(Action.addUserInDB(chat)){
    bot.sendMessage(chat, BTNS.SUCCESS_REGISTER);
  };
}
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  if(msg.text == "/verify") return check(chatId);
  Action.verifyUser(chatId).then((res)=>{
    
    if(res == false){
      bot.sendMessage(chatId,BTNS.ERROR_VERIFY_TEXT);
    }
    else if(res == true){
      if(isDev){
        if(!User.isAdmin) return;
      }


      if(tab == "main"){
        checkAction(msg.text, chatId);
      }
      else if(tab == "gpt" || tab == "image"){
        if(SESSION.doneLast == true){
          checkAction(msg.text, chatId);
          if(tab != "main"){
              sendPrompt(msg.text,chatId);
          }
        }
        else{
          bot.sendMessage(chatId,"📛 Дождитесь обработки предыдущего вопроса. Если бот не отвечает долгое время, то закройте чат")
        }
        
      }
      else if(tab == "promo"){
        Action.usePromo(chatId,msg.text);
      }
    }
  })
  

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