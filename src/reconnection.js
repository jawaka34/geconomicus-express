function try_reconnection(sender){
    for (var i in connections){
        c = connections[i]
        if ( c.open == false) {
            if ( c.pseudo == sender.pseudo){
                send_to_peer_nojson( {x: c.x, y: c.y, money: c.money, score: c.score, avatar: c.avatar, cards: c.cards}, SEND_RECONNECTION, sender)
                connections.splice(i,1)
                break
            }    
        }
       
    }
}