const fs = require('fs');
const data = require('./data.json');
const msgid = require('./message_id.json')
const usr = require('./users.json')
const dateFormat = require('dateformat')
function newUser(user , first_name) {
    if (!data[user]) {
        var array = {
            balance: 0,
            withdrawable: 0,
            referrals: 0,
            inviter: null,
            commisions: {},
            withdrawal_info: {
                name: null,
                number: null,
                amount: null,
                type : null
            },
            first_name : first_name,
             date : dateFormat(new Date().toLocaleString('en-US', "Asia/Manila"), "yyyy-mm-dd h:MM:ss"),
             total : {
                 deposit : 0,
                 withdrawn : 0
             }
        }
        data[user] = array
        msgid[user] = null
        fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
        fs.writeFileSync('message_id.json', JSON.stringify(msgid, null, 3))
    }
}

function referral(user, inviter) {



    if (inviter == "undefined") {
        if (!data[user].inviter) {
            data[user].inviter = "None"
            if (!data[user].inviter) {
                data[user].inviter = inviter
                data[inviter].referrals += 1
            }
        }
        return
    }
    
    if (!data[user].inviter) {
        if (user == inviter) {
            return
        }
        data[user].inviter = inviter
        var array = {
            earn: 0
        }
        data[inviter].commisions[user] = array
        data[inviter].referrals += 1
        fs.writeFileSync('data.json', JSON.stringify(data, null, 3))
    }
}

function commision(user, inviter, amount) {
    if (inviter == "None"){
        return false
    }
    if (!inviter){
        return false
    }
    if (data[inviter].commisions[user].earn < 60) {
        var ibal = data[inviter].withdrawable;
        var chi = data[inviter].balance;
        var earned = data[inviter].commisions[user].earn
        var remaining = 60 - earned
        var bonus = (amount * 0.1)

        if (bonus > remaining) {
            bonus = remaining
        }
        data[inviter].withdrawable = ibal + bonus
        data[inviter].commisions[user].earn += bonus
        fs.writeFileSync('data.json', JSON.stringify(data, null, 3));
        return {
            status: true,
            amount: bonus
        }
    }
    

    return {
        status: false
    }
}

function banCheck(user){
    if (usr.ban.includes(""+user+"")){
        return true
    }
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function group(id){
    //old : -1001368275773
    let group = [ -1001386754804 ,  -458993979 , -486828695]

    if (group.includes(parseInt(id))==false){
        return true
    }
}

module.exports = {
    newUser: newUser,
    referral: referral,
    commision: commision,
    banCheck : banCheck,
    removeA : removeA,
    group : group
}
