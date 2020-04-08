function money_reevaluation(x){
    return Math.floor(x/2) + 8
}

function reevaluate(){
    my_data.money = money_reevaluation(my_data.money)
    send_to_all_peers({money:my_data.money}, "update_money")
}