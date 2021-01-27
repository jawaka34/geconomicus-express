// add_audio() adds an <audio> html object in order to store the audio stream from a specific peer
function add_audio(peer_id) {
    var audio_div = document.getElementById("audio")
    audio_div.innerHTML += peer_id + '<audio controls autoplay id="audio_' + peer_id + '"></audio><br>'
}

distance_to_speak = 50

// update_volumes() updates the volume for all peers in function of the distance to each peer
// (if the peer is too far, then the volume is zero and so they can't speak to each other)
function update_volumes() {
    for (var c of connections) {
        if (c.open) {
            var audiop = document.getElementById("audio_" + c.peer)
            if (audiop != null){
                var d = distance(peer, c) 
                
                if ( d <= distance_to_speak ){
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