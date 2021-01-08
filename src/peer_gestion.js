
function add_default_value(c) {
    c.x = Math.floor(Math.random()*400)
    c.y = Math.floor(Math.random()*400)
    c.pseudo = "Player" +  Math.floor(Math.random()*1000) 
    c.is_courtier = false
    c.score = 0
    c.money = 0
    c.cards = []
    c.credits = []
    c.avatar = my_avatar
}






function send_all_my_data_to_peer_no_reconnection(c){
    send_to_peer_nojson({x: peer.x, y: peer.y}, SEND_UPDATE_DATA_NO_RECONNECTION, c)
    send_to_peer_nojson({pseudo: peer.pseudo}, SEND_UPDATE_DATA_NO_RECONNECTION, c)
    send_to_peer_nojson({avatar: peer.avatar}, SEND_UPDATE_DATA_NO_RECONNECTION, c)
    send_to_peer_nojson({is_courtier: peer.is_courtier}, SEND_UPDATE_DATA_NO_RECONNECTION,c)
    send_to_peer_nojson({score: peer.score},SEND_UPDATE_DATA_NO_RECONNECTION, c)
    send_to_peer_nojson({cards: peer.cards}, SEND_UPDATE_DATA_NO_RECONNECTION,c)
}

function send_all_my_data_to_peer_try_reconnection(c){
    send_to_peer_nojson({x: peer.x, y: peer.y}, SEND_UPDATE_DATA, c)
    send_to_peer_nojson({pseudo: peer.pseudo}, SEND_UPDATE_DATA, c)
    send_to_peer_nojson({avatar: peer.avatar}, SEND_UPDATE_DATA, c)
    send_to_peer_nojson({is_courtier: peer.is_courtier}, SEND_UPDATE_DATA,c)
    send_to_peer_nojson({score: peer.score},SEND_UPDATE_DATA, c)
    send_to_peer_nojson({cards: peer.cards}, SEND_UPDATE_DATA,c)
}



function initialize() {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
        debug: 2
    });

    streams = {} // store the audio streams from other peers

    add_default_value(peer)

    peer.on('open', function (id) {
        console.log('ID: ' + peer.id);
        server_id = document.getElementById("server_id")
        server_id.innerHTML = "Mon ID : " + peer.id;

        var urlParams = new URLSearchParams(window.location.search)
        join(urlParams.get('join'))

        if ( game.mode == MODE_DETTE){
            peer.money = dette_money_init
            send_to_all_peers_nojson({money:peer.money}, SEND_UPDATE_DATA)
        }
        else if ( game.mode == MODE_LIBRE){
            peer.money = libre_money_init
            send_to_all_peers_nojson({money:peer.money}, SEND_UPDATE_DATA)
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
            send_all_my_data_to_peer_no_reconnection(c)
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
                //var remote_audio = document.getElementById("audio_" + call.peer)
                //remote_audio.srcObject = remoteStream

                streams[call.peer] = remoteStream

                // update all the audio html element
                for(var peer_id in streams) {
                    var raudio = document.getElementById("audio_" + peer_id)
                    raudio.srcObject= streams[peer_id]
                }
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
        send_all_my_data_to_peer_try_reconnection(new_conn)
        
        navigator.getUserMedia({ video: false, audio: true }, (stream) => {
            console.log('open stream')
            const call = peer.call(new_conn.peer, stream);

            call.on('stream', (remoteStream) => {
                console.log("calling peer")
                add_audio(new_conn.peer)
                //var remote_audio = document.getElementById("audio_" + call.peer)
                //remote_audio.srcObject = remoteStream

                streams[call.peer] = remoteStream

                // update all the audio html element
                for(var peer_id in streams) {
                    var raudio = document.getElementById("audio_" + peer_id)
                    raudio.srcObject= streams[peer_id]
                }

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
    console.log(data.type)
    switch (data.type) {
       
        case SEND_UPDATE_DATA:
            for ( var property of Object.keys(data) ) {
                if ( property != "type" ){
                    sender[property] = data[property]
                }
                if ( property == "pseudo") {
                    try_reconnection(sender)
                }
                if (property == "score" || property == "pseudo"){
                    update_score_chart()
                }
            }
            update_volumes()
        break
        case SEND_UPDATE_DATA_NO_RECONNECTION:
            for ( var property of Object.keys(data) ) {
                if ( property != "type" ){
                    sender[property] = data[property]
                }
                if (property == "score" || property == "pseudo"){
                    update_score_chart()
                }
            }
        break
        case SEND_RECONNECTION:
            console.log("You receive reconnection data")
            console.log(JSON.stringify(data))
            
            for ( var property of Object.keys(data) ) {
                if ( property != "type" ){
                    peer[property] = data[property]
                }
            }
            update_score_chart()
        break

        case SEND_PEER:
            console.log("Peer received: " + data.peer)
            for (var x of connections) {
                if (x.peer == data.peer) {
                    return
                }
            }
            join(data.peer)
            
            break
        case SEND_OFFER:
            if (peer.money >= card_cost(data)) {
                add_info_card(data, sender)
            }
            else {
                send_to_peer_nojson(data, SEND_NOT_ENOUGH_MONEY, sender)
            }
            
            break
        case SEND_ACCEPT:
            add_info_text(canvas.width/3, canvas.height/3,0,0,"Offre acceptée !\nVous avez gagné " + card_cost(data))
            add_to_my_money(card_cost(data))
            remove_card(data)
            
        break
        case SEND_DECLINE:
            add_info_text(canvas.width/2, canvas.height/2,0,0,"Votre offre a été déclinée")
            reposition_cards()
         
        break
        case SEND_NOT_ENOUGH_MONEY:
            add_info_text(canvas.width/3, canvas.height/3,0,0,"Le joueur n'a pas assez de monnaie ...")
            reposition_cards()
            
            break
        
        case SEND_GAME:
            game = data
             
            break

        case SEND_INTERETS:
            add_to_my_money(data.ammount)
            
        break
        case SEND_HYPOTHEQUE:
            add_card(data)
            
        break
        case SEND_RESET:
            game = data
            reset_my_data()
         
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
    peer.pseudo = document.getElementById("pseudo").value
    update_score_chart()
    send_to_all_peers_nojson({ pseudo: peer.pseudo }, SEND_UPDATE_DATA)

    if ( peer.pseudo == "iagolito" || peer.pseudo == "iago-lito" || peer.pseudo == "Iago-lito"){
        peer.avatar = 0
        send_to_all_peers_nojson({avatar: peer.avatar}, SEND_UPDATE_DATA)
    }
}


function print_peers(){
    var str = ""
    for (var c of connections){

        if ( c.open == false ){
            str += "CLOSED: "
        }
        str += JSON.stringify( {pseudo: c.pseudo, x: c.x, y: c.y, money: c.money, cards: c.cards, score: c.score})
        str += "\n"
    }
    alert(str)
}