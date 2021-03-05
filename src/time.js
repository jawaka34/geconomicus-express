function get_current_time(){
    var d = new Date()
    return d.getTime()
}

game.start_time = get_current_time()


function get_time_left_before_reevaluation(){
    var t = get_current_time()
    if ( game.status == GAME_STATUS_PAUSED){
        t = game.pause_time
    }
    var elapsed_time = Math.floor((t - game.reevaluation_old_time)/1000)
    return game.reevaluation_time - elapsed_time
}

function get_time_left_before_end(){
    var t = get_current_time()
    if ( game.status == GAME_STATUS_PAUSED){
        t = game.pause_time
    }
    var elapsed_time = Math.floor((t - game.start_time)/1000)
    return game.duration - elapsed_time
}

function get_str_time_left_before_end(){
    var t = get_time_left_before_end()
    var str = ""
    str += ~~(t/60) + ":" + (t%60)
    return str 
}


function get_time_left_credit(credit){
    var t = get_current_time()
    if ( game.status == GAME_STATUS_PAUSED){
        t = game.pause_time
    }
    var elapsed_time = Math.floor((t - credit)/1000)
    return game.credit_time - elapsed_time
}

// Credits time must be updated when game is set to Running after a Pause
function update_credits_time(delta){
    console.log(my_credits)
    for (var i in my_credits){     
        my_credits[i] += delta
    }
    console.log(my_credits)
}