function money_reevaluation(x){
    return Math.floor(x/2) + 8
    
    var turn = 1 * document.getElementById("nb_tours").innerText
    var du = 1 * document.getElementById("dividende_universel").innerText
    if(turn % 4 == 0)
        du = universal_divide(du)
    document.getElementById("dividende_universel").innerText = du
    return Math.floor(x + du)
}

function reevaluate(){
    document.getElementById("nb_tours").innerText = (1 * game.turn) + 1
    peer.money = money_reevaluation(peer.money)
    send_to_all_peers_nojson({money:peer.money}, SEND_UPDATE_DATA)
}

function universal_divide(x){
    //DU(t1) = DU(t0) + c² * (M/N) / J
    var m = 1 * document.getElementById("masse_monetaire").innerText
    var n = connections.length
    return Math.floor(x + (0.0488*0.0488) * (m / n) / 2)
}