
function change_game_mode(mode){
    disactivate_menu()
    game.mode = mode
    if ( mode == MODE_WAITING_ROOM){
        game.initial_money = 0
        game.nb_cards_init = 0
        update_game_params_div()
        activate_div_rappel()
        send_to_all_peers_nojson(game, SEND_UPDATE_GAME_PARAMS)
        return
    }
    ask_game_params()
}

game.mode = MODE_WAITING_ROOM
game.letters = ""
game.status = GAME_STATUS_RUNNING
set_default_game_rules()
change_game_mode(MODE_WAITING_ROOM)

function ask_game_params(){
    set_default_game_rules()
    update_game_params_div()
    document.getElementById("game_params").style.display = "block"
}

function validate_game_params(){
    game.duration = document.getElementById("game_params_duration").valueAsNumber*60
    game.square_size = document.getElementById("game_params_square_size").valueAsNumber 
    game.nb_cards_init = document.getElementById("game_params_nb_cards_init").valueAsNumber
    game.letters = "ABCDEFEGHIJKLMNOPQRSTUVWXYZ".substring(0,document.getElementById("game_params_letters").valueAsNumber)

    if (game.mode == MODE_LIBRE){
        game.low_price = document.getElementById("game_params_low_price").valueAsNumber
        game.du = document.getElementById("game_params_du").valueAsNumber
        game.rate = document.getElementById("game_params_rate").valueAsNumber
        game.initial_money = document.getElementById("game_params_initial_money").valueAsNumber
        game.reevaluation_time = document.getElementById("game_params_reevaluation_time").valueAsNumber*60
    }
    if (game.mode == MODE_DETTE){
        game.low_price = document.getElementById("game_params_low_price").valueAsNumber
        game.initial_money = document.getElementById("game_params_initial_money").valueAsNumber
        game.credit_time = document.getElementById("game_params_credit_time").valueAsNumber*60
        game.interet = document.getElementById("game_params_interet").valueAsNumber
        game.initial_credit = document.getElementById("game_params_initial_credit").valueAsNumber
    }

    document.getElementById("game_params").style.display = "none"
    update_game_params_div()
    activate_div_rappel()
    launch_game()
}

function init_my_stuff(){
    my_credits = []
    peer.is_courtier = false
    init_cards()
    peer.money = game.initial_money
    send_to_all_peers_nojson({money: peer.money}, SEND_UPDATE_DATA)
    update_my_score()
    init_monetary_mass_historic()
}

function launch_game(){
    game.status = GAME_STATUS_RUNNING
    game.start_time = get_current_time()
    game.reevaluation_old_time = get_current_time()
    game.turn = 0
    send_to_all_peers_nojson(game, SEND_UPDATE_GAME_PARAMS)
    send_to_all_peers_nojson({}, SEND_INIT_STUFF)
    init_my_stuff()
}

function update_game_params_div(){
    document.getElementById("game_params_duration").value = ~~(game.duration/60)
    document.getElementById("game_params_square_size").value = game.square_size
    document.getElementById("game_params_nb_cards_init").value = game.nb_cards_init
    document.getElementById("game_params_letters").value = game.letters.length

    document.getElementById("game_params_initial_money").value = game.initial_money
    document.getElementById("game_params_low_price").value = game.low_price
    document.getElementById("game_params_du").value = game.du
    document.getElementById("rappel_param_du").innerHTML = game.du
    document.getElementById("game_params_rate").value = game.rate
    document.getElementById("rappel_param_rate").innerHTML = game.rate

    document.getElementById("game_params_reevaluation_time").value = ~~(game.reevaluation_time/60)

    document.getElementById("game_params_credit_time").value = ~~(game.credit_time/60)
    document.getElementById("game_params_interet").value = game.interet
    document.getElementById("game_params_initial_credit").value = game.initial_credit

    document.getElementById("prix_libre_0").innerHTML = game.low_price
    document.getElementById("prix_libre_1").innerHTML = game.low_price*2
    document.getElementById("prix_libre_2").innerHTML = game.low_price*4
    document.getElementById("prix_libre_3").innerHTML = game.low_price*8
    document.getElementById("prix_dette_0").innerHTML = game.low_price
    document.getElementById("prix_dette_1").innerHTML = game.low_price*2
    document.getElementById("prix_dette_2").innerHTML = game.low_price*4
    document.getElementById("prix_dette_3").innerHTML = game.low_price*8


    for (var a of document.getElementsByClassName("param")){
        a.style.display = "none"
    }
    if (game.mode == MODE_LIBRE){
        for(var a of document.getElementsByClassName("param_libre")){
            a.style.display = "block"
        }
    }
    if (game.mode == MODE_DETTE){
        for(var a of document.getElementsByClassName("param_dette")){
            a.style.display = "block"
        }
    }
    
    for ( var a of document.getElementsByClassName("square_size")){
        a.innerHTML = game.square_size
    }
    for ( var a of document.getElementsByClassName("hand_initial_size")){
        a.innerHTML = game.nb_cards_init
    }
    for ( var a of document.getElementsByClassName("letters")){
        a.innerHTML = game.letters.length
    }
}

function set_default_game_rules(){

    game.duration = 120

    // Initial money
    if (game.mode == MODE_LIBRE){
        game.low_price = 6
        game.du = 8
        game.rate = 2
        game.initial_money = 8
        game.reevaluation_time = 60
    }
    else if (game.mode == MODE_DETTE){
        game.low_price = 2
        game.initial_money = 0
        game.interet = 1
        game.initial_credit = 3
        game.credit_time = 60
    }

    var player_count = 1
    for ( var c of connections){
        if (c.open){
            player_count ++
        }
    }

    if ( player_count >= 10){
       game.square_size = 4
       game.nb_cards_init = 4
       game.letters = "ABCDEFEGHIJKLM"
    } else if ( player_count == 8 || player_count == 9){
       game.square_size = 4
       game.nb_cards_init = 5
       game.letters = "ABCDEFEGHIJKLM"
    }
    else if ( player_count == 7){
        game.square_size = 4
        game.nb_cards_init = 5
        game.letters = "ABCDEFEGHIJK"
    }
    else if ( player_count == 6){
        game.square_size = 4
        game.nb_cards_init = 6
        game.letters = "ABCDEFEGHIJK"
    }
    else if ( player_count == 5){
        game.square_size = 3
        game.nb_cards_init = 5
        game.letters = "ABCDEFEGHIJK"
    }
    else if ( player_count == 4){
        game.square_size = 3
        game.nb_cards_init = 6
        game.letters = "ABCDEFEGHIJK"
    }
    else if ( player_count  < 4){
        game.square_size = 3
        game.nb_cards_init = 8
        game.letters = "ABCDEFEGHIJK"
    }

}


function activate_div_rappel(){
    for (var a of document.getElementsByClassName("rappel")){
        a.style.display = "none"
    }

    var actual_div_rappel = null
    switch (game.mode) {
        case MODE_LIBRE:
            actual_div_rappel = document.getElementById("rappel_libre")
            break;
        case MODE_DETTE:
            actual_div_rappel = document.getElementById("rappel_dette")
            break;
        case MODE_WAITING_ROOM:
            actual_div_rappel = document.getElementById("rappel_waiting_room")
            break;
        case MODE_DON:
            actual_div_rappel = document.getElementById("rappel_don")
            break;
    }

    actual_div_rappel.style.display = "block"
}



function change_game_status(status){
    if (game.status == GAME_STATUS_PAUSED && status == GAME_STATUS_RUNNING){
        var delta = get_current_time() - game.pause_time
        game.start_time += delta
        game.reevaluation_old_time += delta
        update_credits_time(delta)
        send_to_all_peers_nojson({delta:delta},SEND_UPDATE_CREDITS_TIME)
    }
    if (game.status == GAME_STATUS_RUNNING &&  status == GAME_STATUS_PAUSED){
        game.pause_time = get_current_time()
    }
    game.status = status
    

    send_to_all_peers_nojson(game, SEND_UPDATE_GAME_PARAMS)
}