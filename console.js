const { Action } = require("./actions");
const { BTNS } = require("./buttons");
const { buildKeyBoard } = require("./keyboard");


function checkAction(msg, id){
 
    if(msg == BTNS.GPT){
      tab = "gpt";
      startSession("chat");
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
      
      startSession("closed");
      if(tab == "gpt" || tab == "image"){
        bot.sendMessage(id,"Чат закрыт",{
        
            reply_markup : {
              keyboard : buildKeyBoard(),
              one_time_keyboard : true
            }
          });
      }
      
      tab = "main";
    }
    else if(msg == BTNS.BALANCE){
        Action.getBalance(id)
    }
    else if(msg == BTNS.ACTIVATE_PROMO){
        tab = "promo";
      
      bot.sendMessage(id,"Введите промокод", {
        reply_markup : {
            keyboard : buildKeyBoard(),
            one_time_keyboard : true
        }
      });
    }
    else if(tab != "promo" && tab != "gpt" && tab != "image"){
      bot.sendMessage(id,"🕹 Выберите действие", {
        reply_markup : {
          keyboard : buildKeyBoard(),
          one_time_keyboard : true
        }
      })
    }
  
  }

module.exports = {checkAction};