
function hypothequer(card) {
    for (var c of connections) {
        if (c.is_courtier && c.open) {
            send_to_peer(card, "hypotheque", c)
        }
    }
}


function payer_interets() {
    for (var c of connections) {
        if (c.is_courtier && c.open) {
            send_to_peer({ ammount: 1 }, "interets", c)
        }
    }
}

function demander_credit() {
    if (is_courtier == false) {
        my_credits.push(get_current_time())
        my_data.money += 3
        send_to_all_peers({money:my_data.money}, "update_money")
    }
}

function rembourser_credit() {
    if (my_data.money >= 4) {
        if (my_credits.length >= 1) {
            my_credits.splice(0, 1)
            my_data.money -= 4
            send_to_all_peers({money:my_data.money}, "update_money")
            payer_interets()
        }
    }
}

function devenir_courtier() {
    for (var c of connections) {
        if (c.open) {
            if (c.is_courtier == true) {
                alert("il y a déjà un courtier")
                return
            }
        }
    }
    is_courtier = true
    send_to_all_peers({ is_courtier: true }, type = "courtier")

}