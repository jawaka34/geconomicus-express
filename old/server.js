peer = null
peers = []
connections = []
points = [{x:100,y:100}]


function initialize_server() {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
        debug: 2
    });

    peer.on('open', function (id) {
        console.log('ID: ' + peer.id);
        server_id = document.getElementById("server_id")
        server_id.innerHTML = "Server ID: " + peer.id;
    });

    peer.on('connection', function (c) {

        for (x of connections){
            x.send('{"peer":"' + c.peer + '"}')
        }

        connections.push(c)
        console.log("New connection: " + c.peer);
        for (x of connections){
            console.log("Peer:" + x.peer)
        }


        
        ready();
    });

   
    peer.on('close', function() {
        connections = null;
        console.log('Connection destroyed');
    });

    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });
};


initialize_server()