
function add_default_value(c) {
    c.x = 50
    c.y = 50
    c.pseudo = c.peer
    c.is_courtier = false
    c.score = 0
    c.money = 0
    c.cards = []
    c.credits = []
}

function send_all_my_data(c){
    send_to_peer_nojson(my_position, SEND_POSITION, c)
    send_to_peer_nojson({pseudo: my_pseudo}, SEND_PSEUDO, c)
    send_to_peer_nojson({ avatar: my_avatar }, SEND_AVATAR, c)
    send_to_peer_nojson({is_courtier:is_courtier}, SEND_UPDATE_COURTIER,c)
    send_to_peer_nojson({score: my_score},SEND_UPDATE_SCORE, c)
}

function initialize() {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
        debug: 2
    });

    peer.on('open', function (id) {
        console.log('ID: ' + peer.id);
        server_id = document.getElementById("server_id")
        server_id.innerHTML = "Mon ID : " + peer.id;

        if ( game.mode == MODE_DETTE){
            my_data.money = dette_money_init
            send_to_all_peers_nojson({money:my_data.money}, SEND_UPDATE_MONEY)
        }
        else if ( game.mode == MODE_LIBRE){
            my_data.money = libre_money_init
            send_to_all_peers_nojson({money:my_data.money}, SEND_UPDATE_MONEY)
        }
    });

    peer.on('connection', function (c) {

        // check if c.peer is not already in the connections
        for (var x of connections) {
            if ( x.open){
                if (x.peer == c.peer) {
                    return
                }
            }
        }

        send_to_all_peers_nojson({peer: c.peer}, SEND_PEER)



        c.on('data', function (data) {
            treat(data, c)
        })

        add_default_value(c)

        c.on('open', function () {
            send_all_my_data(c)
            send_to_peer_nojson(game, SEND_GAME, c)
        })


        connections.push(c)

        console.log("Peers list: ")
        for (var x of connections) {
            if ( x.open){
                console.log("Peer:" + x.peer)
            } 
        }


    });


    peer.on('close', function () {
        connections = null;
        console.log('Connection destroyed');
    });

    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });


    peer.on('call', (call) => {
        console.log("call from" + call.peer)

        navigator.getUserMedia({ video: false, audio: true }, (stream) => {
            call.answer(stream);
            call.on('stream', (remoteStream) => {
                add_audio(call.peer)
                var remote_audio = document.getElementById("audio_" + call.peer)
                remote_audio.srcObject = remoteStream
            });
        }, (err) => {
            console.error('Failed to get local stream', err);
        });
    });


};






// Join some peer
function join(id) {
    console.log("joining " + id)
    var new_conn = peer.connect(id, {
        reliable: true
    })


    new_conn.on('open', function () {
        console.log("Joining: " + new_conn.peer);

        add_default_value(new_conn)
        send_all_my_data(new_conn)
        
        navigator.getUserMedia({ video: false, audio: true }, (stream) => {
            console.log('open stream')
            const call = peer.call(new_conn.peer, stream);

            call.on('stream', (remoteStream) => {
                console.log("calling peer")
                add_audio(new_conn.peer)
                var remote_audio = document.getElementById("audio_" + call.peer)
                remote_audio.srcObject = remoteStream

            });
        }, (err) => {
            console.error('Failed to get local stream', err);
        });


        new_conn.on('data', function (data) {
            treat(data, new_conn)
        });

        new_conn.on('close', function () {
            alert("Connection closed")
        });



    }, (err) => {
        console.error('Failed to get local stream', err);
    });



    connections.push(new_conn)
};

function join_server() {
    id_to_join = document.getElementById("join_id")
    join(id_to_join.value)
}



function treat(data, sender) {
    
    switch (data.type) {
        case SEND_POSITION:
            positions_have_changed = true
            sender.x = data.x
            sender.y = data.y
            return
            break
        case SEND_PSEUDO:
            sender.pseudo = data.pseudo
            update_score_chart()
            return
            break
        case SEND_PEER:
            console.log("Peer received: " + data.peer)
            for (var x of connections) {
                if (x.peer == data.peer) {
                    return
                }
            }
            join(data.peer)
            return
            break
        case SEND_OFFER:
            if (my_data.money >= card_cost(data)) {
                var r = confirm("Accepter l'offre ?\nLettre : " + data.letter + " de niveau " + data.level + "\nCout : " + card_cost(data));
                if (r == true) {
                    if ( my_data.money >= card_cost(data)){
                        my_data.money -= card_cost(data)
                        send_to_all_peers_nojson({money:my_data.money}, SEND_UPDATE_MONEY)
                        add_card(data)
                        send_to_all_peers_nojson({ score: my_score }, SEND_UPDATE_SCORE)
                        send_to_peer_nojson(data, SEND_ACCEPT, sender)
                    }
                    else { // sans ça le joueur peut passer en négatif pendant le moment où il accepte car pendant ce temps un crédit peut être rembourser (ou juste les intérets)
                        send_to_peer_nojson(data, SEND_NOT_ENOUGH_MONEY, sender)
                    }
    
                   
                } else {
                    send_to_peer_nojson(data, SEND_DECLINE, sender)
                }
            }
            else {
                send_to_peer_nojson(data, SEND_NOT_ENOUGH_MONEY, sender)
            }
            return
            break
        case SEND_ACCEPT:
            alert("Offre accepté !\nVous avez gagné " + card_cost(data))
            my_data.money += card_cost(data)
            send_to_all_peers_nojson({money:my_data.money}, SEND_UPDATE_MONEY)
            remove_card(data)
            send_to_all_peers_nojson({score: my_score}, SEND_UPDATE_SCORE)
        return
        break
        case SEND_DECLINE:
            alert("L'offre a été déclinée :(")
            reposition_cards()
        return 
        break
        case SEND_NOT_ENOUGH_MONEY:
            alert("Le joueur n'a pas assez de monnaie !")
            reposition_cards()
            return
            break
        case SEND_AVATAR:
            sender.avatar = data.avatar
        return
        break
        case SEND_GAME:
            game = data
            return 
            break
        case SEND_UPDATE_COURTIER:
            sender.is_courtier = data.is_courtier
            return 
            break
        case SEND_INTERETS:
            my_data.money += data.ammount
            send_to_all_peers_nojson({money:my_data.money}, SEND_UPDATE_MONEY)
        return 
        break
        case SEND_HYPOTHEQUE:
            add_card(data)
            send_to_all_peers_nojson({score: my_score}, SEND_UPDATE_SCORE)
        return 
        break
        case SEND_RESET:
            game = data
            reset_my_data()
        return 
        break
        case SEND_UPDATE_SCORE:
            sender.score = data.score
            update_score_chart()
        return
        break
        case SEND_UPDATE_MONEY:
            sender.money = data.money
        break

    }


}


initialize()






function send_to_peer_nojson(data, type, c) {
    if ( c.open){
        data.type = type
        c.send(data)
    }
}

function send_to_all_peers_nojson(data, type) {
    data.type = type
    for (var c of connections) {
        if (c.open) {
            c.send(data)
        }
    }
}

function change_pseudo() {
    my_pseudo = document.getElementById("pseudo").value
    update_score_chart()
    send_to_all_peers_nojson({ pseudo: my_pseudo }, SEND_PSEUDO)
}


function print_peers(){
    var str = ""
    for (var c of connections){
        if ( c.open){
            str += c.peer + " " + c.pseudo + " " + c.score
            var data = {x:c.x, y:c.y, money:c.money}
            str += JSON.stringify(data)
            str += "\n"
        }
        else {
            str += "(closed: " + c.peer + " " + c.pseudo + " " + c.score + ")"
            str += "\n"
        }
    }
    alert(str)
}