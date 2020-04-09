function get_current_time(){
    var d = new Date()
    return d.getTime()
}

game.start_time = get_current_time()


function get_time_left_before_reevaluation(){
    var t = get_current_time()
    var elapsed_time = Math.floor((t - game.start_time)/1000)
    return reevaluation_period - elapsed_time
}


function get_time_left_credit(credit){
    var t = get_current_time()
    var elapsed_time = Math.floor((t - credit)/1000)
    return credit_period - elapsed_time
}