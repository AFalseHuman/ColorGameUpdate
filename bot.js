const TeleBot = require('telebot');
const fs = require('fs');
const data = require('./data.json')
const buttons = require('./buttons');
const botf = require('./botfunctions');
const bet = require('./bet.json')
    const randomInt = require('random-int');
const moment = require('moment-timezone');
const admins = require('./admin.json')
const qs = require('qs');
const axios = require('axios').default;
const { brotliCompressSync } = require('zlib');
const botfunctions = require('./botfunctions');
const { commision } = require('./botfunctions');
var dateFormat = require('dateformat');
const msgid = require('./message_id.json')
const wd = require('./withdrawals.json')
const tot = require('./total.json')
const usr = require('./users.json');
const { parse } = require('path');
const IterateObject = require("iterate-object");
const bot = new TeleBot({
    token: '1248199965:AAECgRqlbgveg3GrqMov86BOJ-24BTRqzHM',
    usePlugins: ['askUser', 'namedButtons', 'commandButton'],
    pluginConfig: {
        namedButtons: {
            buttons: buttons
        }
    }
});
const room2 = "@peryatrial";

var options = {
    min: 0
    , max: 4
    , integer: true
}


var menu_buttons = bot.keyboard([
    [buttons.deposit.label, buttons.play.label],
    [buttons.balance.label, buttons.withdraw.label],
    [buttons.referral.label, buttons.help.label]
], { resize: true })



bot.on('/start', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    if (msg.chat.type == "private") {
        bot.sendMessage(msg.chat.id, "Hello *" + msg.from.first_name + " *, Welcome To *WalWal Bot. (Perya Color Game)*\n\nThis Bot made with ❤️ by @SpongySpongeBob", {
            replyMarkup: menu_buttons,
            parseMode: "Markdown"
        })

        let params = msg.text.split(" ")
        let inviter = params[1]
        botf.newUser(msg.from.id, msg.from.first_name)
        if (!data[msg.from.id].inviter) {
            if (!inviter) {
                inviter = "undefined"
            }
            botf.referral(msg.from.id, inviter)
        }
    } else {
        bot.deleteMessage(msg.chat.id, msg.message_id)
    }
    if (usr.list.includes(msg.from.id) == false) {
        usr.list.push(msg.from.id)
        fs.writeFileSync("users.json", JSON.stringify(usr, null, 3))
    }
})

bot.on('*', msg => {
    if (msg.chat.type == "supergroup" || msg.chat.type == "group") {

        let che = botf.group(msg.chat.id)
        if (che == true) {
            bot.leaveChat(msg.chat.id)
            bot.sendMessage(msg.chat.id, "Im Not Supposed To Be Here.")
        }
    }
    return
})

bot.on('text', msg => {


    if (msg.text == "/start") {
        return
    }

    var choices = ['red', 'blue', 'yellow', 'green', 'white', 'pink']
    var emojis = ['🔴', '🔵', '🌕', '💚', '⚪️', '🌸']

    var params = msg.text.split(" ");
    var choice = params[0].toLowerCase();
    var amount = parseFloat(params[1]);
    if (!data[msg.from.id]) {
        bot.sendMessage(msg.chat.id, "You Need To Start Before Using Me , Please Go To @realwalwalbot", {
            replyToMessage: msg.message_id
        })
        return
    }
    var balance = data[msg.from.id].balance;
    var withdrawable = data[msg.from.id].withdrawable;



    if (choices.includes(choice)) {
        if (msg.chat.type == "supergroup") {
            var ban = botf.banCheck(msg.from.id)
            if (ban == true) {
                bot.deleteMessage(msg.chat.id, msg.message_id)
                bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
                return
            }

            if (!amount) {
                bot.deleteMessage(msg.chat.id, msg.message_id)
                bot.sendMessage(msg.from.id, "*Your Last Bet Was Invalid Please Use* *Proper Format 'color(space)amount'\n*\n*Example : *\nRed 5", {
                    parseMode: "Markdown"
                })
                return
            }
            if (bet.bets.length < 1) {
                if (amount < 5) {
                    bot.deleteMessage(msg.chat.id, msg.message_id)
                    bot.sendMessage(msg.from.id, "*Minimum Bettig Amount Is ₱5!*", {
                        parseMode: "Markdown"
                    })
                    return
                }
                var mention = 'tg://user?id=' + msg.from.id;
                if (amount <= balance) {
                    data[msg.from.id].balance = balance - amount
                    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
                    let array = {
                        user: msg.from.id,
                        choice: choice,
                        bet: amount
                    }
                    bet.bets.unshift(array)
                    bet.count += 1
                    fs.writeFileSync('bet.json', JSON.stringify(bet, null, 3))


                    function result() {
                        var result1 = randomInt(5)
                        var result2 = randomInt(5)
                        var result3 = randomInt(5)

                        var bluec = 0
                        var redc = 0
                        var whitec = 0
                        var yellowc = 0
                        var greenc = 0
                        var pinkc = 0

                        for (i in bet.bets) {
                            let nm = bet.bets[i];
                            if (nm.choice == "blue") {
                                bluec += nm.bet
                            }
                            if (nm.choice == "red") {
                                redc += nm.bet
                            }
                            if (nm.choice == "yellow") {
                                yellowc += nm.bet
                            }
                            if (nm.choice == "white") {
                                whitec += nm.bet
                            }
                            if (nm.choice == "green") {
                                greenc += nm.bet
                            }
                            if (nm.choice == "pink") {
                                pinkc += nm.bet
                            }
                        }
                        let inline1 = bot.inlineKeyboard([
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })]
                        ])
                        let inline1_2 = bot.inlineKeyboard([
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })]
                        ])
                        let inline1_3 = bot.inlineKeyboard([
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })]
                        ])
                        let inline1_4 = bot.inlineKeyboard([
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })]
                        ])

                        bot.sendMessage(msg.chat.id, "*Rolling Result!*", {
                            parseMode: "Markdown",
                            replyMarkup: inline1
                        }).then(res_1 => {
                                bot.editMessageText(
                                    { chatId: msg.chat.id, messageId: res_1.message_id }, "*Rolling Result!*",
                                { parseMode: 'Markdown', webPreview: false, replyMarkup: inline1_2 }
                            ).then(res_2 => {
                                bot.editMessageText(
                                    { chatId: msg.chat.id, messageId: res_2.message_id }, "*Rolling Result!*",
                                    { parseMode: 'Markdown', webPreview: false, replyMarkup: inline1_3 }
                                ).then(res_3 => {
                                    bot.editMessageText(
                                        { chatId: msg.chat.id, messageId: res_3.message_id }, "*Rolling Result!*",
                                        { parseMode: 'Markdown', webPreview: false, replyMarkup: inline1_4 }
                                    ).then(res => {
                                        setTimeout(function () {
                                            let inline2 = bot.inlineKeyboard([
                                                [bot.inlineButton('|⬇️|⬇️|⬇️|', { url: 't.me/realwalwalbot' })],
                                                [bot.inlineButton('🎰➡️|' + emojis[result1] + '|' + emojis[result2] + '|' + emojis[result3] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                                                [bot.inlineButton('|⬆️|⬆️|⬆️|', { url: 't.me/realwalwalbot' })]
                                            ])
                                            let date = new Date()
                                            var min = 8 * 60
                                            date.setMinutes(date.getMinutes() + min)
                                            var hr = date.getHours()
                                            var min = date.getMinutes()
                                            if (min < 10) {
                                                min = "0" + min
                                            }
                                            var ampm = "AM"
                                            if (hr > 12) {
                                                hr -= 12
                                                ampm = "PM"
                                            }
                                            bot.editMessageText(
                                                { chatId: msg.chat.id, messageId: res.message_id }, "*Result ⬇️*",
                                                { parseMode: 'Markdown', webPreview: false, replyMarkup: inline2 }
                                            ).catch(error => console.log('Error:', error));
                                            bot.sendMessage(msg.chat.id, "*‼️ Game #" + bet.count + " * | " + hr + " : " + min + " " + ampm + "\n\n╔═══════════════════════╗\n   🔆 Betting summary 🔆\n╚═══════════════════════╝\nBet on 🔴 = ₱ " + redc + "\nBet on 🔵 = ₱ " + bluec + "\nBet on 🌕 = ₱ " + yellowc + "\nBet on 💚 = ₱ " + greenc + "\nBet on ⚪️ = ₱ " + whitec + "\nBet on 🌸 = ₱ " + pinkc + "\n\n*🗣 Result for the Game #" + bet.count + "\n*The Winner(s) = " + emojis[result1] + "|" + emojis[result2] + "|" + emojis[result3] + "\nCongratulation to Winners 🎉 👏\n\n*⌛️ Please wait let me transfer Winning(s) to Winner(s) Account.*", {
                                                parseMode: "Markdown"
                                            }).then(res2 => {

                                                var list = {}
                                                for (i in bet.bets) {
                                                    var nm = bet.bets[i];
                                                    console.log(nm)
                                                    var user = nm.user
                                                    var choice = nm.choice
                                                    var amount = nm.bet

                                                    if (!list[user]) {
                                                        list[user] = {
                                                            choices: {},
                                                            id: user
                                                        }
                                                    }


                                                    if (!list[user].choices[choice]){
                                                        list[user].choices[choice] = 0
                                                    }

                                                    list[user].choices[choice] += amount

                                                    
                                                }

                                                console.log(list)

                                                IterateObject(list, function (element) {
                                                    {
                                                        var winlist = []
                                                        IterateObject(element.choices , function(value , col){
                                                            console.log("Color : " +col + " = " +value)
                                                            var winnings = 0
                                                            if (col == choices[result1]) {
                                                                winnings += 1
                                                            }
                                                            if (col == choices[result2]) {
                                                                winnings += 1
                                                            }
                                                            if (col == choices[result3]) {
                                                                winnings += 1
                                                            }

                                                            if (winnings > 0) {
                                                                winnings += 1
                                                                var total = value * winnings
                                                                var won = (total - value)
                                                                data[element.id].withdrawable += total
                                                                fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
                                                                var array = {
                                                                    choice: col,
                                                                    bet: value,
                                                                    total: total,
                                                                    won: won,
                                                                    emoji: emojis[choices.indexOf(col)]
                                                                }
                                                                winlist.push(array)
                                                            }
                                                        })
                                                        var text = "*Your Winnings From Game #" + bet.count + "*\n\n=======================================\n\n"
                                                        var totwin = 0
                                                        for (i in winlist) {
                                                            wl = winlist[i]
                                                            if (winlist.length > 0) {
                                                                text = text + "Color : ( " + wl.choice.toUpperCase() + " " + wl.emoji + ")\nAmount :  ₱" + wl.bet + "\nWinnings In Total : " + wl.total + "\nPayout (Bet Not Included) : " + wl.won + "\n\n=======================================\n\n"
                                                                totwin += wl.won
                                                            }
                                                        }

                                                        if (winlist.length > 0) {
                                                            console.log(winlist)
                                                            var rbal = data[element.id].balance
                                                            var rwd = data[element.id].withdrawable
                                                            var remaining = rbal + rwd
                                                            text = text + "Total Payout From All Winnings (Bet Not Included) : ₱"+totwin+"\n\nRemaining Credits / Balance After The Game : ₱" + remaining

                                                            bot.sendMessage(element.id, text, {
                                                                parseMode: "Markdown"
                                                            })
                                                        }
                                                    }
                                                })

                                                setTimeout(function () {
                                                    axios.post('https://api.telegram.org/bot1248199965:AAECgRqlbgveg3GrqMov86BOJ-24BTRqzHM/setChatPermissions', {
                                                        chat_id: "@" + msg.chat.username,
                                                        permissions: {
                                                            can_send_messages: true
                                                        }
                                                    }).catch(function (error) {
                                                        // handle error
                                                        console.log(error);
                                                    })
                                                    bet.bets = []
                                                    fs.writeFileSync('bet.json', JSON.stringify(bet, null, 3))
                                                    bot.sendMessage(msg.chat.id, "💸 Winning(s) deposited to Winner(s) account.\n\n*Let's Bet :)*\n\n🔴 🔵 🌕 💚 ⚪️ 🌸", {
                                                        parseMode: "Markdown"
                                                    })
                                                }, 1000)

                                            })
                                        }, 2000)
                                    })
                                })
                            })
                        })


                    }
                    setTimeout(function () {
                        axios.post('https://api.telegram.org/bot1248199965:AAECgRqlbgveg3GrqMov86BOJ-24BTRqzHM/setChatPermissions', {
                            chat_id: "@" + msg.chat.username,
                            permissions: {
                                can_send_messages: false
                            }
                        }).catch(function (error) {
                            // handle error
                            console.log(error);
                        })
                    }, 58500)
                    setTimeout(result, 60000)
                    var te = "[" + msg.from.first_name + "](" + mention + "), Opened the bet by Placing " + emojis[choices.indexOf(choice)] + " " + amount + "\n⚠️ Players have around 1 Minute to place their bets.\n\nFor deposit contact only following IDs:\n\n"

                    for (i in admins.admins) {
                        var ji = admins.admins[i]
                        te = te + "✔️ [" + ji.user + "](tg://user?id=" + ji.id + ")\n"
                    }
                    bot.sendMessage(msg.chat.id, te, {
                        parseMode: "Markdown"
                    })
                    bot.sendMessage(msg.from.id, "✅ Your bet of ₱" + amount + " for betting " + emojis[choices.indexOf(choice)] + " for the game #" + bet.count + " Successful.\n Please Visit [" + msg.chat.title + "](https://t.me/" + msg.chat.username + ") and wait for the result. Thank you.\nYour remaining credits after this bet = ₱" + (data[msg.from.id].withdrawable + data[msg.from.id].balance), {
                        parseMode: "Markdown"
                    })
                    return
                }


                let chips = data[msg.from.id].balance

                if (chips !== 0) {
                    amount -= chips;
                     }


                if (amount <= withdrawable) {
                    data[msg.from.id].balance -= chips
                    data[msg.from.id].withdrawable = withdrawable - amount
                    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
                    let array = {
                        user: msg.from.id,
                        choice: choice,
                        bet: amount + chips
                    }
                    bet.bets.unshift(array)
                    bet.count += 1
                    fs.writeFileSync('bet.json', JSON.stringify(bet, null, 3))


                    function result() {
                        var result1 = randomInt(5)
                        var result2 = randomInt(5)
                        var result3 = randomInt(5)

                        var bluec = 0
                        var redc = 0
                        var whitec = 0
                        var yellowc = 0
                        var greenc = 0
                        var pinkc = 0

                        for (i in bet.bets) {
                            let nm = bet.bets[i];
                            if (nm.choice == "blue") {
                                bluec += nm.bet
                            }
                            if (nm.choice == "red") {
                                redc += nm.bet
                            }
                            if (nm.choice == "yellow") {
                                yellowc += nm.bet
                            }
                            if (nm.choice == "white") {
                                whitec += nm.bet
                            }
                            if (nm.choice == "green") {
                                greenc += nm.bet
                            }
                            if (nm.choice == "pink") {
                                pinkc += nm.bet
                            }
                        }
                        let inline1 = bot.inlineKeyboard([
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })]
                        ])
                        let inline1_2 = bot.inlineKeyboard([
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })]
                        ])
                        let inline1_3 = bot.inlineKeyboard([
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })]
                        ])
                        let inline1_4 = bot.inlineKeyboard([
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                            [bot.inlineButton('🎰➡️|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|' + emojis[randomInt(5)] + '|⬅️🎰', { url: 't.me/realwalwalbot' })]
                        ])

                        bot.sendMessage(msg.chat.id, "*Rolling Result!*", {
                            parseMode: "Markdown",
                            replyMarkup: inline1
                        }).then(res_1 => {
                            bot.editMessageText(
                                { chatId: msg.chat.id, messageId: res_1.message_id }, "*Rolling Result!*",
                                { parseMode: 'Markdown', webPreview: false, replyMarkup: inline1_2 }
                            ).then(res_2 => {
                                bot.editMessageText(
                                    { chatId: msg.chat.id, messageId: res_2.message_id }, "*Rolling Result!*",
                                    { parseMode: 'Markdown', webPreview: false, replyMarkup: inline1_3 }
                                ).then(res_3 => {
                                    bot.editMessageText(
                                        { chatId: msg.chat.id, messageId: res_3.message_id }, "*Rolling Result!*",
                                        { parseMode: 'Markdown', webPreview: false, replyMarkup: inline1_4 }
                                    ).then(res => {
                                        setTimeout(function () {
                                            let inline2 = bot.inlineKeyboard([
                                                [bot.inlineButton('|⬇️|⬇️|⬇️|', { url: 't.me/realwalwalbot' })],
                                                [bot.inlineButton('🎰➡️|' + emojis[result1] + '|' + emojis[result2] + '|' + emojis[result3] + '|⬅️🎰', { url: 't.me/realwalwalbot' })],
                                                [bot.inlineButton('|⬆️|⬆️|⬆️|', { url: 't.me/realwalwalbot' })]
                                            ])
                                            bot.editMessageText(
                                                { chatId: msg.chat.id, messageId: res.message_id }, "*Result ⬇️*",
                                                { parseMode: 'Markdown', webPreview: false, replyMarkup: inline2 }
                                            ).catch(error => console.log('Error:', error));
                                            bot.sendMessage(msg.chat.id, "*‼️ Game #" + bet.count + " * | " + moment().tz("Asia/Manila").format() + "\n\n╔═══════════════════════╗\n   🔆 Betting summary 🔆\n╚═══════════════════════╝\nBet on 🔴 = ₱ " + redc + "\nBet on 🔵 = ₱ " + bluec + "\nBet on 🌕 = ₱ " + yellowc + "\nBet on 💚 = ₱ " + greenc + "\nBet on ⚪️ = ₱ " + whitec + "\nBet on 🌸 = ₱ " + pinkc + "\n\n*🗣 Result for the Game #" + bet.count + "\n*The Winner(s) = " + emojis[result1] + "|" + emojis[result2] + "|" + emojis[result3] + "\nCongratulation to Winners 🎉 👏\n\n*⌛️ Please wait let me transfer Winning(s) to Winner(s) Account.*", {
                                                parseMode: "Markdown"
                                            }).then(res2 => {

                                                var list = {}
                                                for (i in bet.bets) {
                                                    var nm = bet.bets[i];
                                                    console.log(nm)
                                                    var user = nm.user
                                                    var choice = nm.choice
                                                    var amount = nm.bet

                                                    if (!list[user]) {
                                                        list[user] = {
                                                            choices: {},
                                                            id: user
                                                        }
                                                    }


                                                    if (!list[user].choices[choice]){
                                                        list[user].choices[choice] = 0
                                                    }

                                                    list[user].choices[choice] += amount

                                                    
                                                }

                                                console.log(list)

                                                IterateObject(list, function (element) {
                                                    {
                                                        var winlist = []
                                                        IterateObject(element.choices , function(value , col){
                                                            console.log("Color : " +col + " = " +value)
                                                            var winnings = 0
                                                            if (col == choices[result1]) {
                                                                winnings += 1
                                                            }
                                                            if (col == choices[result2]) {
                                                                winnings += 1
                                                            }
                                                            if (col == choices[result3]) {
                                                                winnings += 1
                                                            }

                                                            if (winnings > 0) {
                                                                winnings += 1
                                                                var total = value * winnings
                                                                var won = (total - value)
                                                                data[element.id].withdrawable += total
                                                                fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
                                                                var array = {
                                                                    choice: col,
                                                                    bet: value,
                                                                    total: total,
                                                                    won: won,
                                                                    emoji: emojis[choices.indexOf(col)]
                                                                }
                                                                winlist.push(array)
                                                            }
                                                        })
                                                        var text = "*Your Winnings From Game #" + bet.count + "*\n\n=======================================\n\n"
                                                        var totwin = 0
                                                        for (i in winlist) {
                                                            wl = winlist[i]
                                                            if (winlist.length > 0) {
                                                                text = text + "Color : ( " + wl.choice.toUpperCase() + " " + wl.emoji + ")\nAmount :  ₱" + wl.bet + "\nWinnings In Total : " + wl.total + "\nPayout (Bet Not Included) : " + wl.won + "\n\n=======================================\n\n"
                                                                totwin += wl.won
                                                            }
                                                        }

                                                        if (winlist.length > 0) {
                                                            console.log(winlist)
                                                            var rbal = data[element.id].balance
                                                            var rwd = data[element.id].withdrawable
                                                            var remaining = rbal + rwd
                                                            text = text + "Total Payout From All Winnings (Bet Not Included) : ₱"+totwin+"\n\nRemaining Credits / Balance After The Game : ₱" + remaining

                                                            bot.sendMessage(element.id, text, {
                                                                parseMode: "Markdown"
                                                            })
                                                        }
                                                    }
                                                })

                                                setTimeout(function () {
                                                    axios.post('https://api.telegram.org/bot1248199965:AAECgRqlbgveg3GrqMov86BOJ-24BTRqzHM/setChatPermissions', {
                                                        chat_id: "@" + msg.chat.username,
                                                        permissions: {
                                                            can_send_messages: true
                                                        }
                                                    }).catch(function (error) {
                                                        // handle error
                                                        console.log(error);
                                                    })
                                                    bet.bets = []
                                                    fs.writeFileSync('bet.json', JSON.stringify(bet, null, 3))
                                                    bot.sendMessage(msg.chat.id, "💸 Winning(s) deposited to Winner(s) account.\n\n*Let's Bet :)*\n\n🔴 🔵 🌕 💚 ⚪️ 🌸", {
                                                        parseMode: "Markdown"
                                                    })
                                                }, 3000)

                                            })
                                        }, 2000)
                                    })
                                })
                            })
                        })


                    }
                    setTimeout(function () {
                        axios.post('https://api.telegram.org/bot1248199965:AAECgRqlbgveg3GrqMov86BOJ-24BTRqzHM/setChatPermissions', {
                            chat_id: "@" + msg.chat.username,
                            permissions: {
                                can_send_messages: false
                            }
                        }).catch(function (error) {
                            // handle error
                            console.log(error);
                        })
                    }, 58500)
                    setTimeout(result, 60000)
                    var te = "[" + msg.from.first_name + "](" + mention + "), Opened the bet by Placing " + emojis[choices.indexOf(choice)] + " " + (amount + chips) + "\n⚠️ Players have around 1 Minute to place their bets.\n\nFor deposit contact only following IDs:\n\n"

                    for (i in admins.admins) {
                        var ji = admins.admins[i]
                        te = te + "✔️ [" + ji.user + "](tg://user?id=" + ji.id + ")\n"
                    }
                    bot.sendMessage(msg.chat.id, te, {
                        parseMode: "Markdown"
                    })
                    bot.sendMessage(msg.from.id, "✅ Your bet of ₱" + (amount + chips) + " for betting " + emojis[choices.indexOf(choice)] + " for the game #" + bet.count + " Successful.\n Please Visit [" + msg.chat.title + "](https://t.me/" + msg.chat.username + ") and wait for the result. Thank you.\nYour remaining credits after this bet = ₱" + (data[msg.from.id].withdrawable + data[msg.from.id].balance), {
                        parseMode: "Markdown"
                    })
                    } else {
                        bot.deleteMessage(msg.chat.id, msg.message_id)
                        bot.sendMessage(msg.from.id, "You do not have sufficient balance to place this bet.")
                        return
                    }

            } else {
                if (amount < 5) {
                    bot.deleteMessage(msg.chat.id, msg.message_id)
                    bot.sendMessage(msg.from.id, "*Minimum Bettig Amount Is ₱5!*", {
                        parseMode: "Markdown"
                    })
                    return
                }

                if (amount <= balance) {
                    data[msg.from.id].balance = balance - amount
                    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
                    let array = {
                        user: msg.from.id,
                        choice: choice,
                        bet: amount
                    }
                    bet.bets.unshift(array)
                    fs.writeFileSync('bet.json', JSON.stringify(bet, null, 3))
                    bot.sendMessage(msg.from.id, "✅ Your bet of ₱" + amount + " for betting " + emojis[choices.indexOf(choice)] + " for the game #" + bet.count + " Successful.\n Please Visit [" + msg.chat.title + "](https://t.me/" + msg.chat.username + ") and wait for the result. Thank you.\nYour remaining credits after this bet = ₱" + (data[msg.from.id].withdrawable + data[msg.from.id].balance), {
                        parseMode: "Markdown"
                    })
                    return
                }


                let chips = data[msg.from.id].balance

                if (chips !== 0) {
                    amount -= chips;
                }


                if (amount <= withdrawable) {
                   data[msg.from.id].balance -= chips
                    data[msg.from.id].withdrawable = withdrawable - amount
                    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
                    let array = {
                        user: msg.from.id,
                        choice: choice,
                        bet: amount + chips
                    }
                    bet.bets.unshift(array)
                    fs.writeFileSync('bet.json', JSON.stringify(bet, null, 3))
                    bot.sendMessage(msg.from.id, "✅ Your bet of ₱" + (amount + chips) + " for betting " + emojis[choices.indexOf(choice)] + " for the game #" + bet.count + " Successful.\n Please Visit [" + msg.chat.title + "](https://t.me/" + msg.chat.username + ") and wait for the result. Thank you.\nYour remaining credits after this bet = ₱" + (data[msg.from.id].withdrawable + data[msg.from.id].balance), {
                        parseMode: "Markdown"
                    })
                } else {
                    bot.deleteMessage(msg.chat.id, msg.message_id)
                    bot.sendMessage(msg.from.id, "You do not have sufficient balance to place this bet.")
                    return
                }
            }
        } else {
            msg.reply.text("*You Cant Play Here!*", {
                parseMode: "Markdown"
            })
        }

    }
})
bot.on("/deposit", msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let inline = []
    var count = 1
    for (i in admins.admins) {
        var adm = admins.admins[i]
        inline.push([bot.inlineButton("👮‍♀️ ADMIN " + count, { url: "t.me/" + adm.username })])
        count += 1
    }
    var text = "`Your Account ID =  " + msg.from.id + "`\n\n\n_Follow the instructions below to make deposit to your account._\n\n`👉 Tap & copy your User 🆔,   \n👉 Click on any of the buttons & send it to an admin.`\n\n*🔸 YOUR USER 🆔 =   *`" + msg.from.id + "`"

    bot.sendMessage(msg.from.id, text, {
        parseMode: "Markdown",
        replyMarkup: bot.inlineKeyboard(inline)
    })
})

bot.on('/test', msg => {
    console.log(msg)
})

bot.on('/balance', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    var balance = data[msg.from.id].balance
    var withdrawable = data[msg.from.id].withdrawable
    var total = balance + withdrawable

    bot.sendMessage(msg.from.id, "*Chips :* ₱" + balance + "\n*Withdrawable :* ₱" + withdrawable + "*\n\nTotal Balance : *₱" + total, {
        parseMode: "Markdown"
    })

})

bot.on("/send", msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    if (msg.chat.type == "private") {
        console.log("command received")
        
        if (msg.from.id == 1104981525){
            let params = msg.text.split(" ")

            let amount = params[1]
            let id = params[2]

            if (!amount) {
                bot.sendMessage(msg.from.id, "*Wrong Format!*\n\nFormat : send(space)amount(space)id#\n\nExample : send 250 62628282627", {
                    parseMode: "Markdown"
                })
                return
            }
            if (!id) {
                bot.sendMessage(msg.from.id, "*Wrong Format!*\n\nFormat : send(space)amount(space)id#\n\nExample : send 250 62628282627", {
                    parseMode: "Markdown"
                })
                return
            }

            if (Number.isInteger(parseInt(id))==false){
                bot.sendMessage(msg.from.id , "I Need A Valid ID")
                return
            }

            if (!data[id]){
                bot.sendMessage(msg.from.id , "User Havent Start The Bot Yet!! Transaction Cancelled!\n\nAsk Him/Her To Start The Bot First.")
                return
            }

            data[id].balance += parseFloat(amount)
                data[id].total.deposit += parseFloat(amount)
                fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
                tot.deposit += parseFloat(amount)
                fs.writeFileSync('total.json', JSON.stringify(tot, null, 3))
                var bonus = botf.commision(id, data[id].inviter, parseFloat(amount))

                if (bonus.status == true) {
                    bot.sendMessage(data[id].inviter, "🎉 Congratulations you received a referral bonus of ₱" + bonus.amount)
                }
                bot.sendMessage(msg.from.id, "₱" + amount + " Transferred To " + id + " \nRemaining Balance : Infinite")
                bot.sendMessage(-458993979, "@" + msg.from.username + " Sent ₱" + amount + " To [" + id + "](tg://user?id=" + id + ")", {
                    parseMode: "Markdown"
                })
                bot.sendMessage(id, "Your account has been recharged with *₱" + amount + "*\n*ENJOY BETTING :)*\n\nYour Balance = ₱" + data[id].balance, {
                    parseMode: "Markdown"
                })
        }
        for (i in admins.admins) {
            let params = msg.text.split(" ")

            let amount = params[1]
            let id = params[2]

            console.log("Success")

            

            if (!amount) {
                bot.sendMessage(msg.from.id, "*Wrong Format!*\n\nFormat : send(space)amount(space)id#\n\nExample : send 250 62628282627", {
                    parseMode: "Markdown"
                })
                return
            }
            if (!id) {
                bot.sendMessage(msg.from.id, "*Wrong Format!*\n\nFormat : send(space)amount(space)id#\n\nExample : send 250 62628282627", {
                    parseMode: "Markdown"
                })
                return
            }

            if (Number.isInteger(parseInt(id))==false){
                bot.sendMessage(msg.from.id , "I Need A Valid ID")
                return
            }

            var adm = admins.admins[i];

            if (adm.id == msg.from.id) {
                var rbal = adm.balance;
                if (amount <= rbal) {
                    admins.admins[i].balance = rbal - parseFloat(amount)
                    admins.admins[i].sent += parseFloat(amount)
                    fs.writeFileSync('admin.json', JSON.stringify(admins, null, 3))
                    data[id].balance += parseFloat(amount)
                    data[id].total.deposit += parseFloat(amount)
                    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
                    tot.deposit += parseFloat(amount)
                    fs.writeFileSync('total.json', JSON.stringify(tot, null, 3))
                    var bonus = botf.commision(id, data[id].inviter, parseFloat(amount))

                    if (bonus.status == true) {
                        bot.sendMessage(data[id].inviter, "🎉 Congratulations you received a referral bonus of ₱" + bonus.amount)
                    }
                    bot.sendMessage(msg.from.id, "₱" + amount + " Transferred To " + id + " \nRemaining Balance : " + adm.balance)
                    bot.sendMessage(-458993979, "@" + adm.username + " Sent ₱" + amount + " To [" + id + "](tg://user?id=" + id + ")", {
                        parseMode: "Markdown"
                    })
                    bot.sendMessage(id, "Your account has been recharged with *₱" + amount + "*\n*ENJOY BETTING :)*\n\nYour Balance = ₱" + data[id].balance, {
                        parseMode: "Markdown"
                    })
                }
            } else {
                console.log("error")
            }
        }
    } else {
        bot.deleteMessage(msg.chat.id, msg.message_id)
    }

})

bot.on('/referral', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let link = "t.me/realwalwalbot?start=" + msg.from.id

    bot.sendMessage(msg.from.id, "Hello " + msg.from.first_name + ",\n\nReferral Count : " + data[msg.from.id].referrals + "\n\n\nYour Referral Link Is\n\n👉 " + link + "\n\nShare your referral link and get 10% Bonus on Referral's Deposit.\n\n⚠️NOTE:\nYou can only earn a Maximum of ₱ 60.0 (in total) per Referral!", {
        webPreview: false,
        parseMode: "Markdown"
    });
})

bot.on('/load', msg => {

    if (msg.chat.type == "private") {
        var ban = botf.banCheck(msg.from.id)
        if (ban == true) {
            bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
            return
        }
        let params = msg.text.split(" ");

        let amount = parseFloat(params[1]);
        let id = params[2]

        if (!amount) {
            msg.reply.text("Wrong Format!")
            return
        }

        if (!id) {
            msg.reply.text("Wrong Format!")
            return
        }

        if (msg.from.id == 793925144) {
            for (i in admins.admins) {
                var adm = admins.admins[i];

                if (adm.id == id) {
                    admins.admins[i].balance += amount;
                    fs.writeFileSync('admin.json', JSON.stringify(admins, null, 3))
                    bot.sendMessage(msg.from.id, "₱" + amount + " Transfered to reseller ID " + id + "\nReseller's balance = ₱" + admins.admins[i].balance)
                    bot.sendMessage(id, "₱" + amount + " Transferred to your merchant Balance.\nYour new merchant balance = ₱" + admins.admins[i].balance)
                }
            }
        }//end 

        if (msg.from.id == 949167749) {
            for (i in admins.admins) {
                var adm = admins.admins[i];
                console.log(adm)
                if (adm.id == id) {
                    if (admins.admins[0].balance >= amount) {
                        admins.admins[0].balance -= amount
                        admins.admins[0].sent += amount
                        admins.admins[i].balance += amount;
                        fs.writeFileSync('admin.json', JSON.stringify(admins, null, 3))
                        bot.sendMessage(msg.from.id, "₱" + amount + " Transfered to reseller ID " + id + "\nReseller's balance = ₱" + admins.admins[i].balance).catch(err => {
                            console.log(err)
                        })
                        bot.sendMessage(id, "₱" + amount + " Transferred to your merchant Balance.\nYour new merchant balance = ₱" + admins.admins[i].balance).catch(err => {
                            console.log(err)
                        })
                    }else{
                        bot.sendMessage(msg.from.id , "Insuficient Balance!")
                    }
                }
            }
        }
    } else {
        bot.deleteMessage(msg.chat.id, msg.message_id)
    }
})

bot.on('/mbal', msg => {
    if (msg.chat.type == "private") {
        var ban = botf.banCheck(msg.from.id)
        if (ban == true) {
            bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
            return
        }
        for (i in admins.admins) {
            var adm = admins.admins[i];

            if (adm.id == msg.from.id) {
                msg.reply.text("MERCHANT BALANCE = ₱" + adm.balance)
            }
        }
    } else {
        bot.deleteMessage(msg.chat.id, msg.message_id)
    }
})

bot.on('/se', msg => {
    if (msg.chat.type == "private") {
        var ban = botf.banCheck(msg.from.id)
        if (ban == true) {
            bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
            return
        }
        var admin = 793925144;
        var admin2 = 949167749;
        if (msg.from.id == admin || msg.from.id == admin2) {
            var day = dateFormat(new Date().toLocaleString('en-US', "Asia/Manila"), "yyyy/mm/dd h:MM:ss");
            var text = "WALWAL V2.0 , \[" + day + "\]\n\n╔═════════════════╗\n║       Reseller's Data               ║\n╚═════════════════╝\n\n======================\n"
            var total = 0;
            for (i in admins.admins) {
                var adm = admins.admins[i];
                total += adm.balance
                text = text + "" + adm.user + ": " + adm.id + "\nCredits = ₱" + adm.balance + "  Buy = ₱" + adm.sent + "\n======================\n"
            }

            bot.sendMessage(msg.from.id, text + "\n\nTOTAL = " + total, {
                parseMode: "Markdown"
            }).catch(err => {
                console.log(err)
            })
        }
    } else {
        bot.deleteMessage(msg.chat.id, msg.message_id)
    }
})

bot.on('/refund', msg => {
    if (msg.chat.type == "private") {
        var ban = botf.banCheck(msg.from.id)
        if (ban == true) {
            bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
            return
        }
        if (msg.from.id == 793925144) {
            let params = msg.text.split(" ");
            let amount = params[1];
            let id = params[2];

            if (!amount) {
                msg.reply.text("Wrong Format!")
                return
            }

            if (!id) {
                msg.reply.text("Wrong Format!")
                return
            }

            data[id].withdrawable += parseFloat(amount);
            fs.writeFileSync('data.json', JSON.stringify(data, null, 3))

            bot.sendMessage(msg.from.id, "₱" + amount + " Refunded To [" + id + "](tg://user?id=" + id + ")", {
                webPreview: false,
                parseMode: "Markdown"
            })

            var total = (data[id].balance + data[id].withdrawable)

            bot.sendMessage(id, "₱" + amount + " Refunded To Your Account.\n\nTotal Balance : ₱" + total)

        }
    } else {
        bot.deleteMessage(msg.chat.id, msg.message_id)
    }
})

bot.on('/withdraw', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let replyMarkup = bot.inlineKeyboard([
        [bot.inlineButton("🌐 GCash", { callback: '/gcash' })],
        [bot.inlineButton("🧿 CoinsPH", { callback: '/coinsph' })],
        [bot.inlineButton("🅿️ PayMaya", { callback: '/paymaya' })],
        [bot.inlineButton("❌ Cancel", { callback: '/cancel' })]
    ])

    bot.sendMessage(msg.from.id, "*Where would you like to withdraw your funds ?*\n\n*⚠️ Withdrawal request will be processed within 24 hours.*", {
        replyMarkup,
        parseMode: "Markdown"
    }).then(res => {
        let messageid = res.message_id;

        msgid[msg.from.id] = messageid
        fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
    })
})

bot.on('/gcash', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let replyMarkup = bot.keyboard([
        ["❌ Cancel"]
    ], { resize: true })

    bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
        console.log(err)
    })
    data[msg.from.id].withdrawal_info.type = "GCASH"
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
    bot.sendMessage(msg.from.id, "*Send Your Account Name : *", {
        parseMode: "Markdown",
        replyMarkup,
        ask: "accountname"
    }).then(res => {
        let messageid = res.message_id;

        msgid[msg.from.id] = messageid
        fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
    })
})
bot.on('/coinsph', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let replyMarkup = bot.keyboard([
        ["❌ Cancel"]
    ], { resize: true })

    bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
        console.log(err)
    })
    data[msg.from.id].withdrawal_info.type = "COINSPH"
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
    bot.sendMessage(msg.from.id, "*Send Your Account Name : *", {
        parseMode: "Markdown",
        replyMarkup,
        ask: "accountname"
    }).then(res => {
        let messageid = res.message_id;

        msgid[msg.from.id] = messageid
        fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
    })
})
bot.on('/paymaya', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let replyMarkup = bot.keyboard([
        ["❌ Cancel"]
    ], { resize: true })

    bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
        console.log(err)
    })
    data[msg.from.id].withdrawal_info.type = "PAYMAYA"
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
    bot.sendMessage(msg.from.id, "*Send Your Account Name : *", {
        parseMode: "Markdown",
        replyMarkup,
        ask: "accountname"
    }).then(res => {
        let messageid = res.message_id;

        msgid[msg.from.id] = messageid
        fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
    })
})

bot.on('ask.accountname', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let account = msg.text;

    if (account == "❌ Cancel") {
        bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
            console.log(err)
        })
        return bot.sendMessage(msg.from.id, "❌ Recent process cancelled.", {
            replyMarkup: menu_buttons
        })
    }

    let replyMarkup = bot.keyboard([
        ["❌ Cancel"]
    ], { resize: true })
    data[msg.from.id].withdrawal_info.name = account
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
    bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
        console.log(err)
    })
    bot.sendMessage(msg.from.id, "*Send Your "+data[msg.from.id].withdrawal_info.type+"Account Number : *", {
        parseMode: "Markdown",
        replyMarkup,
        ask: "number"
    }).then(res => {
        let messageid = res.message_id;

        msgid[msg.from.id] = messageid
        fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
    })
})


bot.on('ask.number', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let number = msg.text;

    if (number == "❌ Cancel") {
        bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
            console.log(err)
        })
        return bot.sendMessage(msg.from.id, "❌ Recent process cancelled.", {
            replyMarkup: menu_buttons
        })
    }

    let replyMarkup = bot.keyboard([
        ["❌ Cancel"]
    ], { resize: true })
    data[msg.from.id].withdrawal_info.number = number
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
    bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
        console.log(err)
    })
    bot.sendMessage(msg.from.id, "YOU HAVE ₱" + data[msg.from.id].withdrawable + " Withdrawable\n\n*HOW MUCH DO YOU WANT TO WITHDRAW?*\n\n⁉️ Type the amount you want to withdraw. \nE.g. 200 (for ₱ 200)‼️\n\n\n*⚠️ NOTE: MINIMUM WITHDRAWAL IS ₱ 200 ‼️\nWITHDRAWAL REQUEST WILL BE PROCESS WITHIN 24 HOURS*", {
        parseMode: "Markdown",
        replyMarkup,
        ask: "amount"
    }).then(res => {
        let messageid = res.message_id;

        msgid[msg.from.id] = messageid
        fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
    })
})

bot.on('ask.amount', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    if (msg.text == "❌ Cancel") {
        bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
            console.log(err)
        })
        return bot.sendMessage(msg.from.id, "❌ Recent process cancelled.", {
            replyMarkup: menu_buttons
        })
    }

    bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
        console.log(err)
    })
    let replyMarkup = bot.keyboard([
        ["❌ Cancel"]
    ], { resize: true })
    let amount = parseFloat(msg.text);

    if (isNaN(amount)) {
        bot.sendMessage(msg.from.id, "*Incorrect Amount, Send Me Correct Amount.\n⚠️ Minimum Withdraw Is ₱200.*", {
            parseMode: "Markdown",
            replyMarkup,
            ask: "amount"
        }).then(res => {
            let messageid = res.message_id;

            msgid[msg.from.id] = messageid
            fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
        })
        return
    }
    if (amount < 200) {
        bot.sendMessage(msg.from.id, "*Incorrect Amount, Send Me Correct Amount.\n⚠️ Minimum Withdraw Is ₱200.*", {
            parseMode: "Markdown",
            replyMarkup,
            ask: "amount"
        }).then(res => {
            let messageid = res.message_id;

            msgid[msg.from.id] = messageid
            fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
        })
        return
    }
    if (amount > data[msg.from.id].withdrawable) {
        bot.sendMessage(msg.from.id, "*Amount Is Too Big For Your Balance.\n⚠️ Minimum Withdraw Is ₱200.*", {
            parseMode: "Markdown",
            replyMarkup,
            ask: "amount"
        }).then(res => {
            let messageid = res.message_id;

            msgid[msg.from.id] = messageid
            fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
        })
        return
    }

    let button = bot.inlineKeyboard([
        [bot.inlineButton("Confirm ✅", { callback: '/confirm' }),
        bot.inlineButton("❌ Cancel", { callback: '/cancel' })]
    ])
    data[msg.from.id].withdrawal_info.amount = amount
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
    let receipt = data[msg.from.id].withdrawal_info
    bot.sendMessage(msg.from.id, "╔════════════════════╗\n║ Withdrawal Receipt ║\n╚════════════════════╝\n\n*Account : *_" + receipt.type + "_\n*Name : *_" + receipt.name + "_\n*Number : *_" + receipt.number + "_\n*Amount : *_₱" + receipt.amount + "_", {
        replyMarkup: button,
        parseMode: "Markdown",
        ask : "confirmation"
    }).then(res => {
        let messageid = res.message_id;

        msgid[msg.from.id] = messageid
        fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
    }).catch(err => {
        console.log(err)
    })
})

bot.on('/confirm' , msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let receipt = data[msg.from.id].withdrawal_info
        let type = receipt.type
        let name = receipt.name
        let number = receipt.number
        let amount = receipt.amount
        let trxid = wd.trxid + 1
        wd.trxid += 1
        fs.writeFileSync("withdrawals.json", JSON.stringify(wd, null, 3))
        data[msg.from.id].withdrawable -= amount
        fs.writeFileSync('data.json', JSON.stringify(data, null, 3))

        let inline = bot.inlineKeyboard([
            [
                bot.inlineButton("✅ Paid", { callback: "payment_" + type + "µ" + trxid + "µ" + msg.from.id + "µ" + amount  }),
                bot.inlineButton("❌ Cancel", { callback: "cancel_" + type + "µ"  + trxid + "µ" + msg.from.id + "µ" + amount })
            ]
        ])
        bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
            console.log(err)
        })
        var day = dateFormat(new Date().toLocaleString('en-US', "Asia/Manila"), "yyyy/mm/dd h:MM:ss");
        console.log(day)
        bot.sendMessage(-486828695, "╔════════════════════╗\n║ Withdrawal Receipt ║\n╚════════════════════╝\n\n*Date 🗓 : *[" + day + "]\n*Transaction ID : *" + trxid + "\n*User ID : *[" + msg.from.id +"](tg://user?id="+msg.from.id+")" + "\n*Account : *" + type + "\n*Name : *" + name + "\n*Number : *`" + number + "`\n*Amount : *₱" + amount + "\n*Remaining : *₱" + data[msg.from.id].withdrawable, {
            parseMode: "Markdown",
            replyMarkup: inline
        }).then(res => {
            wd.payments[trxid] = res.message_id
            fs.writeFileSync('withdrawals.json', JSON.stringify(wd, null, 3))
        }).catch(err => {
            console.log(err)
        })
        bot.sendMessage(msg.from.id, "╔════════════════════╗\n║ Withdrawal Receipt ║\n╚════════════════════╝\n\n*Date 🗓 : *[" + day + "]\n*Transaction ID : *" + trxid + "\n*Account : *" + type + "\n*Name : *" + name + "\n*Number : *`" + number + "`\n*Amount : *₱" + amount + "\n*Remaining : *₱" + data[msg.from.id].withdrawable + "\n\n✅ Withdrawal Request Sent \n⚠️ Withdrawal Request Will Be Processed Within 24 Hours", {
            parseMode: "Markdown",
            replyMarkup: menu_buttons
        }).catch(err => {
            console.log(err)
        })
})

bot.on('/cancel', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    bot.deleteMessage(msg.from.id, msgid[msg.from.id]).catch(err => {
        console.log(err)
    })
    return bot.sendMessage(msg.from.id, "❌ Recent process cancelled.", {
        replyMarkup: menu_buttons
    })
})

bot.on('callbackQuery', (msg) => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let mdata = msg.data
    if (mdata.includes("payment")) {
        let params = mdata.split("_")
        let param = params[1].split("µ")
        console.log(param)
        let type = param[0];
        let trxid = param[1];
        let id = param[2];
        let amount = parseFloat(param[3]);
        let name = data[id].withdrawal_info.name;
        let number = data[id].withdrawal_info.number
        
        
        let fname = data[id].first_name;

        data[id].total.withdrawn += parseFloat(amount)
        tot.withdraw += parseFloat(amount)
        fs.writeFileSync("total.json", JSON.stringify(tot, null, 3))
        fs.writeFileSync("data.json" , JSON.stringify(data , null ,3))

        bot.sendMessage(id, "_Dear " + fname + ",\nTransaction ID #" + trxid + " marked as paid.\n₱" + amount + " Transferred To Your " + type + " Account_", {
            parseMode: "Markdown"
        })
        
        var day = dateFormat(new Date().toLocaleString('en-US', "Asia/Manila"), "yyyy/mm/dd h:MM:ss");
        var text = "✅ Marked As Paid\n §§§§§§§§§§§§§§§§§§§§ \n\n*Date 🗓 : *[" + day + "]\n*Transaction ID : *" + trxid + "\n*User ID : *[" + id + "](tg://user?id="+id+")"+"\n*Account : *" + type + "\n*Name : *" + name + "\n*Number : *`" + number + "`\n*Amount : *₱" + amount + "\n*Remaining : *₱" + data[id].withdrawable

        let inline = bot.inlineKeyboard([
        ])

        var chid = -486828695
        var mgid = wd.payments[trxid]
        bot.editMessageText(
            { chatId: chid, messageId: mgid }, text,
            { parseMode: 'Markdown', webPreview: false, replyMarkup: inline }
        ).catch(error => console.log('Error:', error));
    }

    if (mdata.includes("cancel")) {
        let params = mdata.split("_")
        let param = params[1].split("µ")
        console.log(param)
        let type = param[0];
        let trxid = param[1];
        let id = param[2];
        let amount = parseFloat(param[3]);
        let name = data[id].withdrawal_info.name;
        let number = data[id].withdrawal_info.number
        let fname = data[id].first_name;

        data[id].withdrawable += amount
        fs.writeFileSync("data.json", JSON.stringify(data, null, 3))

        bot.sendMessage(id, "_Dear " + fname + ",\nTransaction ID #" + trxid + " cancelled upon your request.\n₱" + amount + " returned to your WALWAL account_", {
            parseMode: "Markdown"
        }).catch(err => {
            console.log(err)
        })
        var day = dateFormat(new Date().toLocaleString('en-US', "Asia/Manila"), "yyyy/mm/dd h:MM:ss");
        var text = "❌ Marked As Cancelled\n §§§§§§§§§§§§§§§§§§§§ \n\n*Date 🗓 : *[" + day + "]\n*Transaction ID : *" + trxid + "\n*User ID : *[" + id + "](tg://user?id="+id+")"+ "\n*Account : *" + type + "\n*Name : *" + name + "\n*Number : *`" + number + "`\n*Amount : *₱" + amount + "\n*Remaining : *₱" + data[id].withdrawable

        let inline = bot.inlineKeyboard([  
        ])

        var chid = -486828695
        var mgid = wd.payments[trxid]
        bot.editMessageText(
            { chatId: chid, messageId: mgid }, text,
            { parseMode: 'Markdown', webPreview: false, replyMarkup: inline }
        ).catch(error => console.log('Error:', error));
    }
});

bot.on('/play', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let inline = bot.inlineKeyboard([
        [bot.inlineButton("🔵🔴💚 COLOR GAME", { url: "https://t.me/walwalcolorgame" })],
        [bot.inlineButton("♦️♠️BACCARAT (LUCKY9)❤️♣️" , {url : "https://t.me/fiatphbot"})],
        [bot.inlineButton("♠️♣️♥️ TONG ITS GO", { url: "http://t.me/walwaltongitsgo" })],
        [bot.inlineButton("🐓🐓🐓 SABONG", { url: "http://t.me/sabonglive618" })]
    ])

    bot.sendMessage(msg.from.id, "*Select one of available groups for playing.*", {
        parseMode: "Markdown",
        replyMarkup: inline
    })
})

bot.on('/help', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    let inline = bot.inlineKeyboard([
        [bot.inlineButton("Contact Admin", { url: "http://t.me/colorgameprince" })]
    ])

    bot.sendMessage(msg.from.id, "If you have questions or concerns just contact our admins.\n@colorgameprince", {
        replyMarkup: inline
    })
})

bot.on('/getstat', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    if (msg.chat.type == 'private') {
        var admin = 793925144
        if (msg.from.id == admin) {
            var total = 0
            for (i in usr.list) {
                var user = usr.list[i]
                total += data[user].balance;
                total += data[user].withdrawable;
            }
            var day = dateFormat(new Date().toLocaleString('en-US', "Asia/Manila"), "yyyy/mm/dd h:MM:ss");
            bot.sendMessage(msg.from.id, "*OverAll Bot Statistics*\n\n*Total Holdings : *₱" + total + "\n*Total Deposit : *₱" + tot.deposit + "\n*Total Withdrawals : *₱" + tot.withdraw + "\n\nUpdated On : " + day, {
                parseMode: "markdown"
            })
            console.log(user)
        }
    }
})

bot.on('/ban', msg => {
    var ban = botf.banCheck(msg.from.id)
    if (ban == true) {
        bot.sendMessage(msg.from.id, "You Are Banned From Using The Bot")
        return
    }
    if (msg.chat.type == "private") {
        var admin = 793925144
        if (msg.from.id == admin) {
            let params = msg.text.split(' ')
            let id = params[1]

            if (!id) {
                bot.sendMessage(msg.from.id, "Wrong Format!")
                return
            }

            if (usr.ban.includes(id) == false) {
                usr.ban.push(id)
                fs.writeFileSync('users.json', JSON.stringify(usr, null, 3))
                bot.sendMessage(msg.from.id, id + " Has Been Banned For Using The Bot")
                bot.sendMessage(id, "You Have Been Banned From Using The Bot.")
            } else {
                bot.sendMessage(msg.from.id, "User Was Already Banned")
            }
        }
    }
})


bot.on('/getid', msg => {
    bot.sendMessage(msg.chat.id, msg.reply_to_message.from.id)
})

bot.on('/adminhelp', msg => {
    if (msg.chat.type == "private") {
        bot.sendMessage(msg.from.id, "Admin Commands : \n\n'/send amount id#' - send credit to player\n\n'/mbal' - check merchant balanace\n\nRemember To Use The Proper Format");
    } else {
        bot.deleteMessage(msg.chat.id, msg.message_id)
    }
})

bot.on('/unban', msg => {
    var array = usr.ban

    let params = msg.split(" ")
    let id = params[1]

    if (!id) {
        bot.sendMessage(msg.from.id, "Wrong Format!");
        return
    }

    usr.ban = botf.removeA(array, id)
    fs.writeFileSync("users.json", JSON.stringify(usr, null, 3))

    bot.sendMessage(msg.from.id, id + " Was Banned!")
})

bot.on('forward', msg => {
    var admin = 793925144
    if (msg.from.id == admin) {
        if (msg.chat.type == "private") {
            let id = msg.forward_from.id
            let joined = data[id].date
            let balanace = data[id].balance
            let withdrawable = data[id].withdrawable
            let deposit = data[id].total.deposit
            let withdraw = data[id].total.withdrawn
            let refs = data[id].referrals
            let inviter = data[id].inviter

            if (data[id]) {
                bot.sendMessage(msg.from.id, "*👤 User Found*\n\n*Joined : *" + joined + "\n*User ID : *[" + id + "](tg://user?id="+id+")\n*Balance : *₱" + balanace + "\n*Withdrawable : *₱" + withdrawable + "\n*Total Deposit : *₱" + deposit + "\n*Total Withdraw : *₱" + withdraw + "\n*Referrals : *" + refs + "\n*Referred By : *" + inviter, {
                    parseMode: "Markdown"
                })
            } else {
                bot.sendMessage(msg.from.id, "*👤User Was Not Found*", {
                    parseMode: "Markdown"
                })
            }
        }
    }

    for (i in admins.admins){
        if (admins.admins[i].id == msg.from.id){
           
                if (msg.chat.type == "private") {
                    let id = msg.forward_from.id
                    let joined = data[id].date
                    let balanace = data[id].balance
                    let withdrawable = data[id].withdrawable
                    let deposit = data[id].total.deposit
                    let withdraw = data[id].total.withdrawn
                    let refs = data[id].referrals
                    let inviter = data[id].inviter
        
                    if (data[id]) {
                        bot.sendMessage(msg.from.id, "*👤 User Found*\n\n*Joined : *" + joined + "\n*User ID : *[" + id + "](tg://user?id="+id+")\n*Balance : *₱" + balanace + "\n*Referrals : *" + refs + "\n*Referred By : *" + inviter, {
                            parseMode: "Markdown"
                        })
                    } else {
                        bot.sendMessage(msg.from.id, "*👤User Was Not Found*", {
                            parseMode: "Markdown"
                        })
                    }
                }
            
        }
    }
})

bot.on('/broadcast', msg => {
    bot.sendMessage(msg.from.id, "Send The Message You Want To Be Broadcasted", {
        ask: "message"
    })
})

bot.on('ask.message', msg => {
    for (i in usr.list) {
        var user = usr.list[i]
        bot.sendMessage(user, msg.text)
    }
})

bot.on('/ref4434' , msg => {
    let params = msg.text.split(" ")
    let id = params[1]
    let amount = parseFloat(params[2])

    data[id].withdrawable += amount;
    fs.writeFileSync('data.json' , JSON.stringify(data , null , 3))
    console.log("success")
    bot.sendMessage(id , "Refunded : "+amount)
})

bot.on('/find' , msg => {
    var admin = 793925144
    if (msg.from.id == admin) {
        if (msg.chat.type == "private") {
            let params = msg.text.split(" ")
            let id = params[1]
            let joined = data[id].date
            let balanace = data[id].balance
            let withdrawable = data[id].withdrawable
            let deposit = data[id].total.deposit
            let withdraw = data[id].total.withdrawn
            let refs = data[id].referrals
            let inviter = data[id].inviter

            if (data[id]) {
                bot.sendMessage(msg.from.id, "*👤 User Found*\n\n*Joined : *" + joined + "\n*User ID : *[" + id + "](tg://user?id="+id+")\n*Balance : *₱" + balanace + "\n*Withdrawable : *₱" + withdrawable + "\n*Total Deposit : *₱" + deposit + "\n*Total Withdraw : *₱" + withdraw + "\n*Referrals : *" + refs + "\n*Referred By : *" + inviter, {
                    parseMode: "Markdown"
                })
            } else {
                bot.sendMessage(msg.from.id, "*👤User Was Not Found*", {
                    parseMode: "Markdown"
                })
            }
        }
    }
})

bot.on('/set' , msg => {
    var admin = 793925144

    if (msg.from.id == admin){
        let params = msg.text.split(" ");

        if (params.length<2){
            bot.sendMessage(msg.from.id , "Wrong Format!")
            return 
        }
        if (!params[1]){
            bot.sendMessage(msg.from.id , "Wrong Format!")
            return
        }
        if (!params[2]){
            bot.sendMessage(msg.from.id , "Wrong Format!")
            return
        }
        if (!params[3]){
            bot.sendMessage(msg.from.id , "Wrong Format!")
            return
        }

        let choice = params[1]
        let id = params[2]
        let amount = parseFloat(params[3])

        if (choice == "chips"){
            data[id].balance = amount;
            fs.writeFileSync('data.json' , JSON.stringify(data , null , 3))
            bot.sendMessage(msg.from.id , id + " Chips Set To "+amount);
            bot.sendMessage(id , "Your Chips Was Set To "+amount)
        }

        if (choice == "balance"){
            data[id].withdrawable = amount;
            fs.writeFileSync('data.json' , JSON.stringify(data , null , 3))
            bot.sendMessage(msg.from.id , id + " Withdrawable Balance Set To "+amount);
            bot.sendMessage(id , "Your Withdrawable Balance Was Set To "+amount)
        }
    }
})

bot.on('/reset' , msg => {
    if (msg.from.id == 793925144){
        bet.bets = []
        fs.writeFileSync('bet.json' , JSON.stringify(bet , null ,3))
        bot.sendMessage(msg.from.id , "Bot Was Successfully Restarted.")
    }
})

bot.on('/sendp' , msg => {
    for (i in usr.list){
        var user = usr.list[i]
        var replyMarkup = bot.inlineKeyboard([
            [bot.inlineButton("Visit Facebook Page" , {url : "https://www.facebook.com/permalink.php?story_fbid=126225955718932&id=126206579054203"})]
        ])
        bot.sendPhoto(user , "https://ibb.co/J5TwX0v" , {
            caption : "*HOW TO JOIN?\n\nPLEASE VISIT OUR FACEBOOK PAGE !* [https://www.facebook.com/permalink.php?story_fbid=126225955718932&id=126206579054203]",
            parseMode : "markdown",
            webPreview : false,
            replyMarkup
        }).catch(err => {
            console.log(err)
        })
    }
})

bot.start()
