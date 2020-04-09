
function hypothequer(card) {
    for (var c of connections) {
        if (c.is_courtier && c.open) {
            send_to_peer_nojson(card, SEND_HYPOTHEQUE, c)
        }
    }
}


function payer_interets() {
    for (var c of connections) {
        if (c.is_courtier && c.open) {
            send_to_peer_nojson({ ammount: 1 }, SEND_INTERETS, c)
        }
    }
}

function demander_credit() {
    if (is_courtier == false) {
        my_credits.push(get_current_time())
        my_data.money += 3
        send_to_all_peers_nojson({money:my_data.money}, SEND_UPDATE_MONEY)
    }
}

function rembourser_credit() {
    if (my_data.money >= 4) {
        if (my_credits.length >= 1) {
            my_credits.splice(0, 1)
            my_data.money -= 4
            send_to_all_peers_nojson({money:my_data.money}, SEND_UPDATE_MONEY)
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
    send_to_all_peers_nojson({ is_courtier: true }, SEND_UPDATE_COURTIER)

}