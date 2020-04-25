
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
    if (peer.is_courtier == false) {
        my_credits.push(get_current_time())
        add_to_my_money(3)
       
    }
}

function rembourser_credit() {
    if (peer.money >= 4) {
        if (my_credits.length >= 1) {
            my_credits.splice(0, 1)
            add_to_my_money(-4)
            payer_interets()
        }
    }
}

function devenir_courtier() {
    if (peer.is_courtier) {
        add_info_text(canvas.width/2, canvas.height/2,300,70,"Vous êtes déjà le courtier", false)
    }
    for (var c of connections) {
        if (c.open) {
            if (c.is_courtier == true) {
                add_info_text(canvas.width/2, canvas.height/2,100,100,"Il y a déjà un courtier", false)
                return
            }
        }
    }
    update_is_courtier(true)
}


function update_is_courtier(value){
    peer.is_courtier = value
    send_to_all_peers_nojson({ is_courtier: peer.is_courtier }, SEND_UPDATE_DATA)

}