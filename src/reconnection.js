function try_reconnection(sender) {
    ajouter_message_au_chat2("TRY RECONNECTION")
    for (var i in connections) {
        var c = connections[i]
        if (c.open == false) {
            if (c.pseudo == sender.pseudo) {
                send_to_peer_nojson({ x: c.x, y: c.y, money: c.money, score: c.score, avatar: c.avatar }, SEND_RECONNECTION, sender)
                connections.splice(i, 1)
                break
            }
        }

    }
}