let BTNS = {
    IMAGE : "🖼 Сгенерировать картинку",
    GPT : "🤖 Обращение к ИИ",
    CLOSE : "❌ Закрыть",
    ACTIVATE_PROMO : "🎫 Активировать промо-код",
    BALANCE : "💎 Баланс",
    ERROR_VERIFY_TEXT : "⛔ Ваш аккаунт не найден. Пропишите команду /verify",
    SUCCESS_REGISTER : "✅ Ваш аккаунт зарегистрирован! Отправьте любое сообщение",
    PROMO_ACTIVATED : "🎫 Промокод активирован",
    PROMO_FAILED : "⛔ Вы уже активировали этот промо-код",
    ENOUGH_MONEY : "⛔ На вашем балансе недосточно средств",
    successPayment(summ){
        return `💎 На ваш счет зачислено ${summ} баллов.`
    },
    succesBuy(cost){
        return `💎 С вашего счета списано ${cost} баллов.`
    }
  }
module.exports = {BTNS};