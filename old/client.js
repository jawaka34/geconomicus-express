peer = null
connections = []
positions = []



function initialize() {
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
        connections.push(c)
        console.log("New connection: " + c.peer);
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


// Join some peer
function join(id) {
    var new_conn = peer.connect(id, {
        reliable: true
    })

    connections.push(new_conn)

    new_conn.on('open', function () {
        console.log("Connected to: " + new_conn.peer);
        }, (err) => {
            console.error('Failed to get local stream', err);
        });
    

    // Handle incoming data (messages only since this is the signal sender)
    new_conn.on('data', function (data) {
        alert(data)
        obj = JSON.parse(data)
        if (obj.peer != null){
            join(obj.peer)
        }
    });

    new_conn.on('close', function () {
        alert("Connection closed")
    });
};

function join_server() {
    server_id = document.getElementById("join_id")
    join(server_id.value)
}


initialize()