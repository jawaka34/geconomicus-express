

function update_audio_div() {
    var audio_div = document.getElementById("audio_details");
    audio_div.innerHTML = ""
    for (var c of connections) {
        if (c.open){
            if (audio_gains[c.peer] != null) {
                audio_div.innerHTML += '<img width="20px" src="' + avatars_data[c.avatar].right + '"/>' + audio_gains[c.peer].gain.value + '<br>'
                if (audio_rms[c.peer] != null) {
                    audio_div.innerHTML += audio_rms[c.peer];
                }
            }
        }
        
    }
}


// add_audio() adds an <audio> html object in order to store the audio stream from a specific peer
function add_audio(peer_id) {
    var audio_div = document.getElementById("audio")
    audio_div.innerHTML += peer_id + '<audio controls autoplay id="audio_' + peer_id + '"></audio><br>'
    var audiop = document.getElementById("audio_" + peer_id)
    audiop.volume = 0
    ajouter_message_au_chat2("ajout_audio : " + peer_id)
}



function remove_audio(peer_id) {
    ajouter_message_au_chat2("remove audio(" + peer_id + ")")
    var audio_element = document.getElementById("audio_" + peer_id)
    if (audio_element != null) {
        audio_element.remove()
    }
}



function update_all_audio_sources_streams() {
    ajouter_message_au_chat2("update_all_audio_sources_streams()")
    for (var peer_id in streams) {
        var raudio = document.getElementById("audio_" + peer_id)
        if (raudio != null) {
            raudio.srcObject = streams[peer_id]
        }
        else {
            ajouter_message_au_chat2("raudio is null " + peer_id)
        }
    }
}



function reload_all_audio_sources() {
    ajouter_message_au_chat2("Reload_all_audio_sources()")
    disactivate_menu()

    for (var c of connections) {
        remove_audio(c.peer)
    }


    for (var c of connections) {
        var call = peer.call(c.peer, my_stream)

        call.on('stream', (remoteStream) => {
            add_audio(c.peer)
            streams[call.peer] = remoteStream
            update_all_audio_sources_streams()
            update_volumes()

        });
    }


}



// update_volumes() updates the volume for all peers in function of the distance to each peer
// (if the peer is too far, then the volume is zero and so they can't speak to each other)
function update_volumes() {
    update_audio_div()
    for (var c of connections) {
        if (true || c.open) {

            if (audio_gains[c.peer] != null) {
                var d = distance(peer, c)
                if (c.speaking_to_all || (game.status != GAME_STATUS_OVER && d <= distance_to_speak)) {
                    audio_gains[c.peer].gain.value = .5;
                } else {
                    audio_gains[c.peer].gain.value = .0;
                }
            }



            var audiop = document.getElementById("audio_" + c.peer)
            if (audiop != null) {
                var d = distance(peer, c)

                if (c.speaking_to_all || (game.status != GAME_STATUS_OVER && d <= distance_to_speak)) {
                    audiop.volume = 1


                }
                else {
                    audiop.volume = 0


                }
            }
        }
    }
}