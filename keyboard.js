const { BTNS } = require("./buttons");


class Btn{
    constructor(text) {
        return {
            text : text
        }
    }
}

function buildKeyBoard(){
    let obj = null;
    if(tab == "main"){
      obj = [
        new Btn(BTNS.IMAGE),
        new Btn(BTNS.GPT),
        new Btn(BTNS.BALANCE),
        new Btn(BTNS.ACTIVATE_PROMO)
      ]
    }
    else{
      obj = [
        new Btn(BTNS.CLOSE)
      ]
    }
    return [obj];
    
  }
  function defaultReply(){
    return {
        reply_markup : {
            keyboard : buildKeyBoard(),
            one_time_keyboard : true
            }
    }
}
module.exports = {Btn, buildKeyBoard, defaultReply};