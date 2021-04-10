
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
            send_to_peer_nojson({ ammount: game.interet }, SEND_INTERETS, c)
        }
    }
}

function demander_credit() {
    document.getElementById("menu").style.display = "none"
    if (peer.is_courtier == false) {
        var have_bank = false
        for (var c of connections) {
            if (c.open) {
                if (c.is_courtier == true) {
                    have_bank = true
                    break
                }
            }
        }
        if (!have_bank) {
            add_info_simple("Vous ne pouvez pas demander de crédit car personne ne s'est désigné encore pour être courtier", canvas.width / 2, canvas.height / 2)
            return
        }
        add_info_simple("La banque vous fait un prêt de " + game.initial_credit + ". Dans " + game.credit_time/60 + " minutes, elle récupérera automatiquement l'argent prêté + " + game.interet + " d'intéret.", bank.x, bank.y)
        my_credits.push(get_current_time())
        add_to_my_money(game.initial_credit)

    }
}

function rembourser_credit() {
    document.getElementById("menu").style.display = "none"
    if (peer.money >= game.initial_credit + game.interet) {
        if (my_credits.length >= 1) {
            my_credits.splice(0, 1)
            add_to_my_money(-game.initial_credit - game.interet)
            payer_interets()
        }
    }
}

function devenir_courtier() {
    document.getElementById("menu").style.display = "none"
    if (peer.is_courtier) {
        add_info_simple("Vous êtes déjà le courtier" ,canvas.width / 2, canvas.height / 2 )
    }
    for (var c of connections) {
        if (c.open) {
            if (c.is_courtier == true) {
                add_info_simple("Il y a déjà un courtier" ,canvas.width / 2, canvas.height / 2 )
                return
            }
        }
    }
    update_is_courtier(true)
}


function update_is_courtier(value) {
    peer.is_courtier = value
    send_to_all_peers_nojson({ is_courtier: peer.is_courtier }, SEND_UPDATE_DATA)

}