function money_reevaluation(x){
    return Math.floor(x/2) + 8
}

function reevaluate(){
    my_data.money = money_reevaluation(my_data.money)
    send_to_all_peers_nojson({money:my_data.money}, SEND_UPDATE_MONEY)
}