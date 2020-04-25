function money_reevaluation(x){
    return Math.floor(x/2) + 8
}

function reevaluate(){
    peer.money = money_reevaluation(peer.money)
    send_to_all_peers_nojson({money:peer.money}, SEND_UPDATE_DATA)
}