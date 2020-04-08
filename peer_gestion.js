
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
    send_to_peer(my_position, "position", c)
    send_to_peer({ pseudo: my_pseudo }, "pseudo", c)
    send_to_peer({ avatar: my_avatar }, "avatar", c)
    send_to_peer({is_courtier:is_courtier}, "courtier",c)
    send_to_peer({score: my_score}, "score", c)
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

        for (var x of connections) {
            if (x.open){
                var data = '{"type": "peer", "peer_id":"' + c.peer + '"}'
                console.log("Send: " + data + " to " + x.peer)
                x.send(data)
            }
            
        }



        c.on('data', function (data) {
            treat(data, c)
        })

        add_default_value(c)

        c.on('open', function () {
            send_all_my_data(c)
            send_to_peer(game, "game", c)
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
                remote_audio = document.getElementById("audio_" + call.peer)
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
    var obj = JSON.parse(data)

    if (obj.peer_id != null) {
        console.log("Peer received: " + obj.peer_id)
        for (var x of connections) {
            if (x.peer == obj.peer_id) {
                return
            }
        }
        join(obj.peer_id)
    }

    else if (obj.type == "position") {
        positions_have_changed = true
        sender.x = obj.x
        sender.y = obj.y
    }

    else if (obj.type == "pseudo") {
       sender.pseudo = obj.pseudo
       update_score_chart()
    }

    else if (obj.type == "offer") {
        if (my_data.money >= card_cost(obj)) {
            var r = confirm("Accepter l'offre ?\nLettre : " + obj.letter + " de niveau " + obj.level + "\nCout : " + card_cost(obj));
            if (r == true) {
                if ( my_data.money >= card_cost(obj)){
                    my_data.money -= card_cost(obj)
                    send_to_all_peers({money:my_data.money}, "update_money")
                    add_card(obj)
                    send_to_all_peers({ score: my_score }, "score")
                    send_to_peer(obj, "accept", sender)
                }
                else { // sans ça le joueur peut passer en négatif pendant le moment où il accepte car pendant ce temps un crédit peut être rembourser (ou juste les intérets)
                    send_to_peer(obj, "not_enough_money", sender)
                }

               
            } else {
                send_to_peer(obj, "decline", sender)
            }
        }
        else {
            send_to_peer(obj, "not_enough_money", sender)
        }


    }

    else if (obj.type == "accept") {
        alert("Offre accepté !\nVous avez gagné " + card_cost(obj))
        my_data.money += card_cost(obj)
        send_to_all_peers({money:my_data.money}, "update_money")
        remove_card(obj)
        send_to_all_peers({score: my_score}, "score")
    }

    else if (obj.type == "decline") {
        alert("L'offre a été déclinée :(")
        reposition_cards()
    }
    else if (obj.type == "not_enough_money"){
        alert("Le joueur n'a pas assez de monnaie !")
        reposition_cards()
    }

    else if (obj.type == "avatar") {
        sender.avatar = obj.avatar
    }
    else if (obj.type == "game"){
        game = obj
    }
    else if (obj.type == "courtier"){
        sender.is_courtier = obj.is_courtier
    }
    else if (obj.type == "interets"){
        my_data.money += obj.ammount
        send_to_all_peers({money:my_data.money}, "update_money")
    }
    else if (obj.type == "hypotheque"){
        add_card(obj)
        send_to_all_peers({score: my_score}, "score")
    }
    else if (obj.type == "reset"){
        game = obj
        reset_my_data()
    }
    else if (obj.type== "score"){
        sender.score = obj.score
        update_score_chart()
    }
    else if (obj.type == "update_money"){
        sender.money = obj.money
    }

}


initialize()





function send_to_peer(data, type, c) {
    if ( c.open){
        data.type = type
        data_str = JSON.stringify(data)
        c.send(data_str)
    }
   
}

function send_to_all_peers(data, type) {
    data.type = type
    data_str = JSON.stringify(data)
    for (c of connections) {
        if (c.open) {
            c.send(data_str)
        }
    }
}

function change_pseudo() {
    my_pseudo = document.getElementById("pseudo").value
    update_score_chart()
    send_to_all_peers({ pseudo: my_pseudo }, "pseudo")
}


function print_peers(){
    var str = ""
    for ( c of connections){
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