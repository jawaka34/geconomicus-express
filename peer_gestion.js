i_am_server = false
peer = null
connections = []
points = [{x:100,y:100}]



function initialize() {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
        debug: 2
    });

    peer.on('open', function (id) {
        console.log('ID: ' + peer.id);
        server_id = document.getElementById("server_id")
        server_id.innerHTML = "ID: " + peer.id;
    });

    peer.on('connection', function (c) {

        // check if c.peer is not already in the connections
        for ( x of connections ){
            if (x.peer == c.peer) {
                return
            }
        }

        for (x of connections){
            x.send('{"peer_id":"' + c.peer + '"}')
        }

        

        c.on('data', function (data) {
            treat(data, c.peer)
        })

        c.x = 50
        c.y = 50
        c.on( 'open', function () {
            c.send(JSON.stringify(points[0]))
        })
        

        connections.push(c)

        console.log("New connection: " + c.peer);
        for (x of connections){
            console.log("Peer:" + x.peer)
        }


    });

   
    peer.on('close', function() {
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

function add_audio(peer_id){
    var audio_div = document.getElementById("audio")
    audio_div.innerHTML += '<audio autoplay controls id="audio_' + peer_id + '"></audio>'
}


// Join some peer
function join(id) {
    console.log("joining " + id)
    var new_conn = peer.connect(id, {
        reliable: true
    })

    
    

    new_conn.on('open', function () {
        console.log("Connected to: " + new_conn.peer);

        new_conn.x = 50
    new_conn.y = 50

        new_conn.send(JSON.stringify(points[0]))


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
    

        // Handle incoming data (messages only since this is the signal sender)
    new_conn.on('data', function (data) {
        treat(data, new_conn.peer)
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



function treat(data, peer_id) {

    var obj = JSON.parse(data)
    
    if (obj.peer_id != null){
        console.log("join peer proposition: " + obj.peer_id)
        for ( x of connections ){
            if (x.peer == obj.peer_id) {
                return
            }
        }
        join(obj.peer_id)
    }

    if ( obj.x != null){
        for (c of connections){
            if ( c.peer == peer_id){
                c.x = obj.x
                c.y = obj.y
            }
        }
        points_print(ctx)
        changevol()
    }

}


initialize()



function changevol() {
    for ( c of connections) {  
        var audiop = document.getElementById("audio_" + c.peer)
        var x = Math.sqrt((points[0].x-c.x)*(points[0].x-c.x) + (points[0].y-c.y)*(points[0].y-c.y))/(Math.sqrt(2)*500)
         audiop.volume  = 1 -x

    }
    
}