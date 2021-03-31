
function add_default_value(c) {
    ajouter_message_au_chat2("ADD DEFAULT VALUE " + c.peer)
    c.x = Math.floor(Math.random()*400)
    c.y = Math.floor(Math.random()*400)
    c.pseudo = "Player" +  Math.floor(Math.random()*1000)
    c.is_courtier = false
    c.score = 0
    c.money = 0
    c.cards = []
    c.credits = []
    c.avatar = my_avatar
    c.speaking_to_all = false
    c.avatar_direction = DIR_LEFT
    c.organizer = false

    c.pseudoCanvas = generate_text_canvas(c.pseudo)
    c.moneyCanvas = generate_text_canvas(c.money)
    ajouter_message_au_chat2("- fin add default value " + c.peer)
}



function generate_text_canvas(text){
    var textCanvas = document.createElement('canvas')
    var textCtx = textCanvas.getContext('2d')

    textCtx.fillStyle = 'black';
    textCtx.font = '20px Arial';
    var text_measures = textCtx.measureText(text)

    textCanvas.width = text_measures.width
    textCanvas.height = 20;
    textCtx.fillStyle = 'black';
    textCtx.font = '20px Arial';
    textCtx.textBaseline = 'top';
    textCtx.fillText(text, 0, 0);
    return textCanvas
}


function send_all_my_data_to_peer_no_reconnection(c){
    send_to_peer_nojson({x: peer.x, y: peer.y}, SEND_UPDATE_DATA_NO_RECONNECTION, c)
    send_to_peer_nojson({pseudo: peer.pseudo}, SEND_UPDATE_DATA_NO_RECONNECTION, c)
    send_to_peer_nojson({avatar: peer.avatar}, SEND_UPDATE_DATA_NO_RECONNECTION, c)
    send_to_peer_nojson({is_courtier: peer.is_courtier}, SEND_UPDATE_DATA_NO_RECONNECTION,c)
    send_to_peer_nojson({score: peer.score},SEND_UPDATE_DATA_NO_RECONNECTION, c)
    //send_to_peer_nojson({cards: peer.cards}, SEND_UPDATE_DATA_NO_RECONNECTION,c)
    send_to_peer_nojson({money: peer.money}, SEND_UPDATE_DATA_NO_RECONNECTION,c)
    send_to_peer_nojson({organizer: peer.organizer}, SEND_UPDATE_DATA_NO_RECONNECTION,c)
}

function send_all_my_data_to_peer_try_reconnection(c){
    send_to_peer_nojson({x: peer.x, y: peer.y}, SEND_UPDATE_DATA, c)
    send_to_peer_nojson({pseudo: peer.pseudo}, SEND_UPDATE_DATA, c)
    send_to_peer_nojson({avatar: peer.avatar}, SEND_UPDATE_DATA, c)
    send_to_peer_nojson({is_courtier: peer.is_courtier}, SEND_UPDATE_DATA,c)
    send_to_peer_nojson({score: peer.score},SEND_UPDATE_DATA, c)
    //send_to_peer_nojson({cards: peer.cards}, SEND_UPDATE_DATA,c)
    send_to_peer_nojson({money: peer.money}, SEND_UPDATE_DATA,c)
    send_to_peer_nojson({organizer: peer.organizer}, SEND_UPDATE_DATA,c)
}

function initialize() {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
        debug: 2
    });

    streams = {} // store the audio streams from other peers

    add_default_value(peer)

    peer.on('open', function (id) {
        vider_chat2()
        ajouter_message_au_chat2("--- Informations débugage ---\n")
        ajouter_message_au_chat2("mon id " + peer.id)
        document.getElementById("invitation_link").value = document.location.href + "?join=" + peer.id 
        console.log('ID: ' + peer.id);
        var server_id = document.getElementById("server_id")
        server_id.innerHTML = "Mon ID : " + peer.id;

        navigator.getUserMedia({ video: false, audio: true }, (stream) => {
            my_stream = stream
            var urlParams = new URLSearchParams(window.location.search)
            if ( urlParams.get('join')== null){
                peer.organizer = true
                document.getElementById("organizer_actions").style.display = "block"
            }
            join(urlParams.get('join'))

        }, (err) => {
            console.error('Failed to get local stream', err);
        });

        

        /*
        TODO


        navigator.getUserMedia({ video: false, audio: true }, (stream) => {
            var audioContext = new AudioContext();
                var mediaStreamSource = audioContext.createMediaStreamSource(stream);
                var processor = audioContext.createScriptProcessor(2048, 1, 1);

                mediaStreamSource.connect(audioContext.destination);
                mediaStreamSource.connect(processor);
                processor.connect(audioContext.destination);

                processor.onaudioprocess = function (e) {
                    var inputData = e.inputBuffer.getChannelData(0);
                    var inputDataLength = inputData.length;
                    var total = 0;

                    for (var i = 0; i < inputDataLength; i++) {
                        total += Math.abs(inputData[i++]);
                    }

                    var rms = Math.sqrt(total / inputDataLength);

                   distance_to_speak = rms*200
                }
        })
        */
    });

    peer.on('connection', function (new_peer) {
        console.log('connection from ' + new_peer.peer)
        ajouter_message_au_chat2("connection de " + new_peer.peer)
        // check if c.peer is not already in the connections
        for (var x of connections) {
            if ( true || x.open){
                if (x.peer == new_peer.peer) {
                    ajouter_message_au_chat2("Il est déjà dedans " + new_peer.peer)
                    return
                }
            }
        }
        ajouter_message_au_chat2("il est pas dans la liste" + new_peer.peer)

        add_default_value(new_peer)
        connections.push(new_peer)
        ajouter_message_au_chat2("AJOUT à la liste de " + new_peer.peer)

        //console.log('send peer to all peers')
        //send_to_all_peers_nojson({peer: c.peer}, SEND_PEER)

        new_peer.on('data', function (data) {
            treat(data, new_peer)
        })

        new_peer.on('open', function () {
            ajouter_message_au_chat2("connection ouverte de " + new_peer.peer)
            send_all_my_data_to_peer_no_reconnection(new_peer)
            send_to_peer_nojson(game, SEND_UPDATE_GAME_PARAMS, new_peer)
            
            peers_id_list = []
            for( var x of connections){
                if(true || x.open){
                    peers_id_list.push(x.peer)
                }
            }
            ajouter_message_au_chat2("j'envoie la liste suivante à " + new_peer.peer + " " + JSON.stringify(peers_id_list))
            send_to_peer_nojson({list:peers_id_list}, SEND_PEERS_LIST, new_peer)
            console.log("send peers list")
        })

        new_peer.on('close', function(){
            ajouter_message_au_chat2("Connection fermée : " + new_peer.peer)
            ajouter_message_au_chat2("Tentative reconnection avec : " + new_peer.peer)
            var index = connections.indexOf(new_peer);
             if (index > -1) { 
                ajouter_message_au_chat2("Index trouvé : " + new_peer.peer)
                 connections.splice(index, 1);
                 remove_audio(new_peer.peer)
                 join(new_peer.peer)
            }
        })

        ajouter_message_au_chat2("fonctions ajoutés à " + new_peer.peer)

        console.log("Peers list: ")
        for (var x of connections) {
            if ( x.open){
                console.log("Peer:" + x.peer)
            }
            else {
                console.log("Peer:" + x.peer + " [closed]")
            }
        }
    });

    peer.on('close', function () {
        connections = null;
        console.log('Connection destroyed');
    });

    peer.on('error', function (err) {
        console.log(err);
        ajouter_message_au_chat2("Erreur : " + err)
    });

    peer.on('call', (call) => {
        ajouter_message_au_chat2("call from " + call.peer)

        
            call.answer(my_stream);
            ajouter_message_au_chat2("answer call " + call.peer)
            call.on('stream', (remoteStream) => {
                if ( document.getElementById("audio_" + call.peer) != null){
                    remove_audio(call.peer)
                }
                add_audio(call.peer)
                streams[call.peer] = remoteStream
                update_all_audio_sources_streams()
                update_volumes()
            });
       
    });
};


// Join some peer
function join(id) {
    if (id == null){
        return;
    }
    console.log("joining " + id+ "------")
    ajouter_message_au_chat2("JOINING " + id)

    for (var x of connections) {
        if ( true || x.open){
            if (x.peer == id) {
                console.log(id + " (" + x.pseudo + ") is already in peers")
                ajouter_message_au_chat2("en fait il est déjà dans la liste ")
                return
            }
        }
    }

    var new_conn = peer.connect(id, {
        reliable: true
    })

    

    new_conn.on('open', function () {
        console.log("Joining: " + new_conn.peer);
        ajouter_message_au_chat2("OPEN avec " + new_conn.peer)

        add_default_value(new_conn)
        send_all_my_data_to_peer_try_reconnection(new_conn)

        
            console.log('open stream')
            var call = peer.call(new_conn.peer, my_stream);
            ajouter_message_au_chat2("CALLING " + new_conn.peer)

            call.on('stream', (remoteStream) => {
                ajouter_message_au_chat2("STREAM " + new_conn.peer)
                add_audio(new_conn.peer)
                streams[call.peer] = remoteStream
                update_all_audio_sources_streams()
                update_volumes()
            });
        

        new_conn.on('data', function (data) {
            treat(data, new_conn)
        });

        new_conn.on('close', function () {
            ajouter_message_au_chat2("Connection fermée : " + new_conn.peer)
            const index = connections.indexOf(new_conn);
             if (index > -1) { 
                ajouter_message_au_chat2("Index trouvé : " + new_conn.peer)
                 connections.splice(index, 1);
                remove_audio(new_conn.peer)
            }
        });

    }, (err) => {
        console.error('Failed to get local stream', err);
    });

    ajouter_message_au_chat2("Ajout à la liste : " + new_conn.peer)
    connections.push(new_conn)
};

function join_server() {
    id_to_join = document.getElementById("join_id")
    join(id_to_join.value)
}

function treat(data, sender) {
    console.log(data.type)
    switch (data.type) {
        case SEND_PEERS_LIST:
            console.log("Receive peers list from " + sender.peer)
            console.log(data.list)
            ajouter_message_au_chat2("je reçois la liste de " + sender.peer + " " + data.list)
            for (var peer_id of data.list){
                if (peer_id != peer.id){
                    join(peer_id)
                }
            }
        break
        case SEND_UPDATE_DATA:
            for ( var property of Object.keys(data) ) {
                if ( property != "type" ){
                    sender[property] = data[property]
                }
                if ( property == "pseudo") {
                    sender.pseudoCanvas = generate_text_canvas(sender.pseudo)
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
                    sender.pseudoCanvas = generate_text_canvas(sender.pseudo)
                    update_score_chart()
                }
            }
            update_volumes()
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
                    if (x.open == false){
                        console.log("bug : fait un return alors que la connexion est fermée")
                    }
                    return
                }
            }
            join(data.peer)
        break
        case SEND_OFFER:
            if (game.mode == MODE_DON){
                add_card(data)
            }
            else{
                if (peer.money >= card_cost(data)) {
                    add_info_card(data, sender)
                }
                else {
                    send_to_peer_nojson(data, SEND_NOT_ENOUGH_MONEY, sender)
                }
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
        case SEND_INTERETS:
            add_to_my_money(data.ammount)
        break
        case SEND_MESSAGE:
            ajouter_message_au_chat_new(sender, data.message)
        break
        case SEND_HYPOTHEQUE:
            add_card(data)
        break
        
        case SEND_PEERS_DATA_RESUME:
            //sender.peers_data_resume = data.peers_data_resume
            ajouter_message_au_chat_debug(data.peers_data_resume)
        break
        case SEND_ASK_DEBUG_DATA:
            var peers_str = "--- Peer: " + peer.id.substring(0,4) + " " + peer.pseudo + "\n"
            for (var c of connections){
                if ( c.open){
                    var audiop = document.getElementById("audio_" + c.peer)
                    if (audiop != null){
                        peers_str += c.peer.substring(0,4) + " " + c.pseudo + " " + audiop.volume + "\n"
                    }
                    else {
                        peers_str += c.peer.substring(0,4) + " " + c.pseudo + "\n"
                    }
                }
            }
            for (var c of connections){
                if ( c.open == false ){
                    var audiop = document.getElementById("audio_" + c.peer)
                    if (audiop != null){
                        peers_str += "(" + c.peer.substring(0,4) + " " + c.pseudo + " " + audiop.volume + ")\n"
                    }
                    else {
                        peers_str += "(" + c.peer.substring(0,4) + " " + c.pseudo + ")\n"
                    }
                }
            }
            send_to_peer_nojson({peers_data_resume:peers_str}, SEND_PEERS_DATA_RESUME, sender)
        break
        case SEND_INIT_STUFF:
            init_my_stuff()
        break
        case SEND_UPDATE_GAME_PARAMS:
            game = data
            update_game_params_div()
            activate_div_rappel()
            if ( peer.money == 0 && peer.cards.length == 0 ){
                init_my_stuff()
            }
        break
        case SEND_UPDATE_CREDITS_TIME:
            update_credits_time(data.delta)
        break
    }
}

initialize()

function send_to_peer_nojson(data, type, c) {
    if ( true || c.open){
        data.type = type
        c.send(data)
    }
}

function send_to_all_peers_nojson(data, type) {
    data.type = type
    for (var c of connections) {
        if (true ||c.open) {
            c.send(data)
        }
    }
}

function change_pseudo() {
    peer.pseudo = document.getElementById("pseudo").value
    peer.pseudoCanvas = generate_text_canvas(peer.pseudo)
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
        str += JSON.stringify( {pseudo: c.pseudo, x: c.x, y: c.y, money: c.money, score: c.score})
        str += "\n"
    }
    alert(str)
}

function ask_debug_data(){
    vider_chat_debug("")

    var peers_str = "- Mes Peers : " + peer.id.substring(0,4) + " " + peer.pseudo + "\n"
            for (var c of connections){
                if ( c.open){
                    var audiop = document.getElementById("audio_" + c.peer)
                    if (audiop != null){
                        peers_str += c.peer.substring(0,4) + " " + c.pseudo + " " + audiop.volume + "\n"
                    }
                    else {
                        peers_str += c.peer.substring(0,4) + " " + c.pseudo + "\n"
                    }
                }
            }
            for (var c of connections){
                if ( c.open == false ){
                    var audiop = document.getElementById("audio_" + c.peer)
                    if (audiop != null){
                        peers_str += "(" + c.peer.substring(0,4) + " " + c.pseudo + " " + audiop.volume + ")\n"
                    }
                    else {
                        peers_str += "(" + c.peer.substring(0,4) + " " + c.pseudo + ")\n"
                    }
                }
            }

    //ajouter_message_au_chat_debug(JSON.stringify(peer.connections))
    ajouter_message_au_chat_debug(peers_str)
    send_to_all_peers_nojson({}, SEND_ASK_DEBUG_DATA)
}