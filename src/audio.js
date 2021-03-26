// add_audio() adds an <audio> html object in order to store the audio stream from a specific peer
function add_audio(peer_id) {
    var audio_div = document.getElementById("audio")
    audio_div.innerHTML += peer_id + '<audio controls autoplay id="audio_' + peer_id + '"></audio><br>'
    var audiop = document.getElementById("audio_" + peer_id)
    audiop.volume = 0
    ajouter_message_au_chat2("ajout_audio : " + peer_id )
}

function remove_audio(peer_id){
    document.getElementById("audio_" + peer_id).remove()
}

distance_to_speak = 60

// update_volumes() updates the volume for all peers in function of the distance to each peer
// (if the peer is too far, then the volume is zero and so they can't speak to each other)
function update_volumes() {
    for (var c of connections) {
        if (true || c.open) {
            var audiop = document.getElementById("audio_" + c.peer)
            if (audiop != null){
                var d = distance(peer, c) 
                
                if (  c.speaking_to_all || d <= distance_to_speak ){
                    audiop.volume = 1
                }
                /*
                else if (d <= 150){
                    audiop.volume = 1 - (d-50)/100
                }
                */
                else {
                    audiop.volume = 0
                }

                
            }
        }
    }
}