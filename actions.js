const { BTNS } = require("./buttons");
const { buildKeyBoard } = require("./keyboard");
let lastVerified;
let Action = {
    addUserInDB(chatID){
        Action.verifyUser(chatID).then((res)=>{
            if(!res){
                DB.query('INSERT INTO users VALUES (?,?,?,?,?)',[null, chatID, 0, 0, "[]"],(err, r)=>{
                    if(err) return false;
                    return true;
                })
            }
        })
    },
    verifyUser(chatID){
        if(lastVerified != true){
            let promise = new Promise((resolve,reject)=>{
                let find = null;
                DB.query('SELECT * FROM users WHERE userID = ?', [chatID], function(err, r) {
              
                    if (err) return console.log(err);
                    if(r.length < 1) find = false;
                    else{
                        User.isAdmin = r[0].isAdmin;
                        User.balance = r[0].balance;
                        lastVerified = true;
                        find = true;
                    }
                    
                });
                setTimeout(()=>{
                    resolve(find);
                },1000)
            })
            return promise;
        }
        else{
            return new Promise((resolve,reject)=>resolve(true));
        }
        
    },
    getBalance(chatID){
        DB.query('SELECT balance FROM users WHERE userID = ?', [chatID], function(err, r) {
          
            if (err) return console.log(err);
            bot.sendMessage(chatID,"💎 Ваш баланс: " + r[0].balance + " баллов")
        });
    },
    buyItem(chatID, cost){
        DB.query('UPDATE users SET balance = (balance - ?) WHERE userID = ?',[cost,chatID],(err,r)=>{
            bot.sendMessage(chatID,BTNS.succesBuy(cost), {reply_markup : {
                keyboard : buildKeyBoard(),
                one_time_keyboard : true
            }});
        })
        User.balance -= cost;
    },
    usePromo(chatID,pname){
        DB.query('SELECT usedPromos FROM users WHERE userID = ?', [chatID], function(err, r) {
            
            let promos = JSON.parse(r[0].usedPromos);
            console.log(promos)
            if(promos.includes(pname)) {
                tab = "main";
                bot.sendMessage(chatID,BTNS.PROMO_FAILED, {reply_markup : {
                    keyboard : buildKeyBoard(),
                    one_time_keyboard : true
                }});
                return;
            }
            DB.query('SELECT * FROM promos WHERE name = ?',[pname],function(err,r){
                if(r.length > 0){
                    let bonus = r[0].balanceBonus;
                    DB.query('UPDATE users SET balance = (balance + ?) WHERE userID = ?',[bonus,chatID],(err,r)=>{
                        bot.sendMessage(chatID,BTNS.PROMO_ACTIVATED);
                        tab = "main";
                        bot.sendMessage(chatID,BTNS.successPayment(bonus), {reply_markup : {
                            keyboard : buildKeyBoard(),
                            one_time_keyboard : true
                        }});
                    })
                    promos.push(pname);
                    DB.query('UPDATE users SET usedPromos = ?',[JSON.stringify(promos)]);
                }
                else{
                    tab = "main";
                    bot.sendMessage(chatID,'Промо-код не найден', {reply_markup : {
                        keyboard : buildKeyBoard(),
                        one_time_keyboard : true
                    }});
                    
                }
            });

        });
    }
};
module.exports = {Action};