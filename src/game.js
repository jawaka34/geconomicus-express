
function print_infos(){
    for (var info of infos){

        if (info.type == INFO_TYPE_CARD){

            ctx.beginPath()
            ctx.fillStyle = "#a2a4a6"
            ctx.rect(info.x, info.y, info.w, info.h);
            ctx.fill();

            ctx.beginPath()
            ctx.fillStyle = "#FF5050"
            ctx.rect(info.x, info.y + info.h-30, info.w/2, 30)
            ctx.fill()

            ctx.beginPath()
            ctx.fillStyle = "#BEFF80"
            ctx.rect(info.x+ info.w/2, info.y + info.h-30, info.w/2, 30)
            ctx.fill()

            ctx.font = "16px Arial"
            ctx.fillStyle = "black"
            ctx.fillText(info.text, info.x+card_width+10, info.y + 20 )

            ctx.font = "16px Arial"
            ctx.fillStyle = "black"
            ctx.fillText("Oui",info.x+ info.w*3/4-10, info.y + info.h-10 )

            ctx.font = "16px Arial"
            ctx.fillStyle = "black"
            ctx.fillText("Non",info.x+ info.w*1/4-10, info.y + info.h-10 )

            ctx.fillText("Cout : " + card_cost(info.card), info.x+card_width+10, info.y + 40 )

            print_card(info.card)

        }

        if (info.type == INFO_TYPE_TEXT){
            ctx.font = "16px Arial"


            ctx.beginPath()
            ctx.fillStyle = "#a2a4a6"
            ctx.rect(info.x, info.y, info.w, info.h);
            ctx.fill();

            if (info.declinable == true){
                ctx.beginPath()
                ctx.fillStyle = "red"
                ctx.rect(info.x, info.y + info.h-30, info.w/2, 30)
                ctx.fill()
            }

            ctx.beginPath()
            ctx.fillStyle = "green"
            ctx.rect(info.x+ info.w/2, info.y + info.h-30, info.w/2, 30)
            ctx.fill()
            ctx.fillStyle = "white"
            ctx.fillText("OK", info.x+ info.w*3/4, info.y + info.h-15 )

            ctx.fillStyle = "black"
            ctx.fillText(info.text, info.x+5, info.y + 20 )
        }

    }
}


function add_info_text(x, y, w, h, text, declinable) {
    ctx.font = "16px Arial"
    var m=ctx.measureText(text)
    infos.push({ x: x, y: y, w: m.width +10, h: card_height, type: INFO_TYPE_TEXT, text: text, declinable: declinable })
}

function add_info_card(card, sender){
    ctx.font = "16px Arial"
    var text = "Proposition de " + sender.pseudo
    var m=ctx.measureText(text)
    var w = m.width + card_width+15
    var h = 110
    var x = card.x-5
    var y = card.y-5
 
    // correct x and y if the box will go out of screen
    if (x + w > 500 ){
        card.x -= (x+w)-500
        x -= (x+w)-500
    }
    if (y + h > 500){
        card.y -= (y+h)-500
        y -= (y+h)-500
    }

    info = {x:x ,y:y, w: w ,h: h, type:INFO_TYPE_CARD, card:card, declinable: true, text: text, sender: sender}
    infos.push(info)
}

function click_on_info_accept(info, mouse){
    return ( info.x+ info.w/2 <= mouse.x && mouse.x <= info.x+ info.w
        && info.y + info.h-30 <= mouse.y && mouse.y <= info.y + info.h)
}

function click_on_info_decline(info, mouse){
    return ( info.x <= mouse.x && mouse.x <= info.x+ info.w/2
        && info.y + info.h-30 <= mouse.y && mouse.y <= info.y + info.h)
}

function print_my_money(){
    ctx.fillStyle = "black"
    ctx.font = "30px Arial"
    ctx.fillText(peer.money, 0, 450)
    ctx.drawImage(img_coin,0,450,40,40)
}

function get_mouse_coord(canvas, e) {
    var offsetX = 0, offsetY = 0, mx, my

    // Compute the total offset
    if (canvas.offsetParent !== undefined) {
        do {
            offsetX += canvas.offsetLeft
            offsetY += canvas.offsetTop
        } while ((canvas = canvas.offsetParent))
    }

    mx = e.pageX - offsetX
    my = e.pageY - offsetY

    return { x: mx, y: my }
}

function print_background(ctx){
    ctx.beginPath()
    ctx.fillStyle = "#f9f2ec"
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
}

function points_print(ctx) {
    if ( peer_selected != null){
        ctx.beginPath()
                ctx.arc(peer_selected.x, peer_selected.y, point_radius, 0, 2 * Math.PI)
                ctx.fillStyle = "red"
                ctx.fill()
    }

    for (var p of connections) {
        if (p.open){
            if (p.avatar == null) {
                ctx.beginPath()
                ctx.arc(p.x, p.y, point_radius, 0, 2 * Math.PI)
                ctx.fillStyle = "black"
                ctx.fill()
            }
            else {
                if (p.avatar_direction == DIR_LEFT)
                    ctx.drawImage(avatars_data[p.avatar].left_img, p.x - 20, p.y - 20, 40, 40)

                if (p.avatar_direction == DIR_RIGHT)
                    ctx.drawImage(avatars_data[p.avatar].right_img, p.x - 20, p.y - 20, 40, 40)

                if (p.is_courtier){
                    ctx.drawImage(img_chapeau, p.x - 10, p.y -48, 40, 40)
                }
            }

            ctx.font = "20px Arial"
            ctx.fillStyle = "black"
            var pseudo_measures = ctx.measureText(p.pseudo)
            ctx.fillText(p.pseudo, p.x - pseudo_measures.width/2, p.y - 23)
        }

    }

    var p = {x: peer.x, y: peer.y}
    if (peer.avatar == null) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, point_radius, 0, 2 * Math.PI)
        ctx.fillStyle = "black"
        ctx.fill()
    }
    else {
        ctx.beginPath()
        ctx.arc(p.x, p.y, distance_to_speak, 0, 2 * Math.PI)
        ctx.strokeStyle = "grey"
        ctx.stroke()

        if (peer.avatar_direction == DIR_LEFT)
            ctx.drawImage(avatars_data[peer.avatar].left_img, p.x - 20, p.y - 20, 40, 40)

        if (peer.avatar_direction == DIR_RIGHT)
            ctx.drawImage(avatars_data[peer.avatar].right_img, p.x - 20, p.y - 20, 40, 40)

        if (peer.is_courtier){
            ctx.drawImage(img_chapeau, p.x - 10, p.y -48, 40, 40)
        }
    }

}



var keyState = {};
window.addEventListener('keydown', function (e) {
    keyState[e.keyCode || e.which] = true;
}, true);
window.addEventListener('keyup', function (e) {
    keyState[e.keyCode || e.which] = false;
}, true);


function gameLoop(ctx) {

    if (debug){
        var peers_list = []
        var peers_str = ""
        for (var c of connections){
            if ( c.open){
                var audiop = document.getElementById("audio_" + c.peer)
                if (audiop != null){
                    peers_str += c.peer.substring(0,4) + " " + c.pseudo + " " + audiop.volume + "\n"
                    peers_list.push([c.peer.substring(0,4), c.pseudo, c.open, audiop.volume])
                }
                else {
                    peers_str += c.peer.substring(0,4) + " " + c.pseudo + "\n"
                    peers_list.push([c.peer.substring(0,4), c.pseudo, c.open])
                }
            }
        }
        for (var c of connections){
            if ( c.open == false ){
                var audiop = document.getElementById("audio_" + c.peer)
                if (audiop != null){
                    peers_str += "(" + c.peer.substring(0,4) + " " + c.pseudo + " " + audiop.volume + ")\n"
                    peers_list.push([c.peer.substring(0,4), c.pseudo, c.open, audiop.volume])
                }
                else {
                    peers_str += "(" + c.peer.substring(0,4) + " " + c.pseudo + ")\n"
                    peers_list.push([c.peer.substring(0,4), c.pseudo, c.open])
                }
            }
        }
        vider_chat_new(peers_str)
        send_to_all_peers_nojson({list: peers_list}, SEND_PEERS_DATA_RESUME)
        var msg = ""
        for (var c of connections){
            msg += c.peer + " " +  c.pseudo +  "\n"
            msg += JSON.stringify(c.peers_data_resume)
            msg += "\n"
        }
        vider_chat_debug(msg)
    }

    var speed = 2
    var speedv2 = 3.5
    var my_position_has_changed = false

    // move the avatar with mouse
    if (move_target != null && (peer.x != move_target.x || peer.y != move_target.y ) ) {
        positions_have_changed = true
        my_position_has_changed = true
        if (move_target.x >= peer.x){
            peer.avatar_direction = DIR_RIGHT
        }
        else {
            peer.avatar_direction = DIR_LEFT
        }
        var dist = Math.sqrt( (move_target.x - peer.x)**2 + (move_target.y - peer.y)**2 )
        if ( dist > speedv2 ){
            peer.x += speedv2 * (move_target.x - peer.x) /dist
            peer.y += speedv2 * (move_target.y - peer.y) /dist
        }

    }

    if (keyState[85] && peer.speaking_to_all == false){ // 85 = u
        peer.speaking_to_all = true
        send_to_all_peers_nojson({speaking_to_all: peer.speaking_to_all}, SEND_UPDATE_DATA_NO_RECONNECTION)
        update_volumes()
    }
    else if (keyState[85] == false && peer.speaking_to_all) {
        peer.speaking_to_all = false
        send_to_all_peers_nojson({speaking_to_all: peer.speaking_to_all}, SEND_UPDATE_DATA_NO_RECONNECTION)
        update_volumes()
    }

    if (keyState[83] || keyState[40]) {
        if (peer.y + speed < canvas.height) {
            positions_have_changed = true
            my_position_has_changed = true
            peer.y += speed;
        }
    }
    if (keyState[90] || keyState[38]) {
        if (peer.y - speed > 0) {
            positions_have_changed = true
            my_position_has_changed = true
            peer.y -= speed;
        }
    }
    if (keyState[37] || keyState[81]) {
        if (peer.x - speed > 0) {
            positions_have_changed = true
            peer.x -= speed;
            peer.avatar_direction = DIR_LEFT
            my_position_has_changed = true
        }
    }
    if (keyState[39] || keyState[68]) {
        if (peer.x + speed < canvas.width) {
            positions_have_changed = true
            my_position_has_changed = true
            peer.x += speed;
            peer.avatar_direction = DIR_RIGHT
        }
    }

   

    slide_little_card()
    print_background(ctx)

    if (game.mode == MODE_DETTE){
        ctx.drawImage(img_bank, bank_position.x -40, bank_position.y - 40, 80, 80)
    }

    points_print(ctx)
    print_my_cards(ctx)
    print_my_money()
    print_infos()

    if ( my_position_has_changed){
        send_to_all_peers_nojson({x: peer.x, y: peer.y, avatar_direction: peer.avatar_direction}, SEND_UPDATE_DATA)
    }

    if (true && positions_have_changed) {
        update_volumes()
    }

    if (game.mode == MODE_LIBRE)
    {
        ctx.font = "20px Arial"
        ctx.fillStyle = "black"
        ctx.fillText("Prochaine réévaluation : " + get_time_left_before_reevaluation(), 0,30)

        if ( get_time_left_before_reevaluation() < 0){
            game.start_time = get_current_time()
            game.turn ++
            reevaluate()
        }
    }

    if (game.mode == MODE_DETTE){

        for (var i in my_credits){
            ctx.font = "16px Arial"
            ctx.fillStyle = "black"
            ctx.fillText("Crédit à rembourser dans : " + get_time_left_credit(my_credits[i]) + "s", 0,30 + i*30)

            if (get_time_left_credit(my_credits[i]) < 0){

                if ( peer.money >= 4){
                    add_to_my_money(-4)
                    payer_interets()
                    my_credits.splice(i,1)
                }
                else if ( peer.money >= 1){
                    add_to_my_money(-1)
                    my_credits.splice(i,1)
                    my_credits.push(get_current_time())
                    payer_interets()
                }
                else {
                    if ( peer.cards.length >= 1){
                        my_credits.splice(i,1)
                        my_credits.push(get_current_time())
                        hypothequer(peer.cards[0])
                        remove_card(peer.cards[0])
                    }
                    else {
                        my_credits.splice(i,1)
                    }

                }
                break
            }
        }
    }


    var do_search_square = true
    for (var card of peer.cards) {
        if (card.x != card.target_x && card.y != card.target_y) {
            do_search_square = false
            break
        }
    }
    if (do_search_square) {
        search_and_apply_square()
    }

    positions_have_changed = false

}

function play_libre(){
    game.mode = MODE_LIBRE
    game.turn = 0
    game.start_time = get_current_time()
    send_to_all_peers_nojson(game, SEND_RESET)
    reset_my_data()
}

function play_dette(){
    game.mode = MODE_DETTE
    game.turn = 0
    game.start_time = get_current_time()
    send_to_all_peers_nojson(game, SEND_RESET)
    reset_my_data()
}


function reset_my_data(){
    update_rules()

    my_credits = []
    peer.is_courtier = false

    if ( game.mode == MODE_LIBRE){
        peer.money = libre_money_init
        init_cards()
        document.getElementById("rappel_dette").style.display = "none"
        document.getElementById("rappel_libre").style.display = "block"
        document.getElementById("nb_tours").innerText = 1
        document.getElementById("dividende_universel").innerText = 8
        document.getElementById("masse_monetaire").innerText = 0
    }
    else if (game.mode == MODE_DETTE){
        peer.money = 0
        init_cards()
        document.getElementById("rappel_dette").style.display = "block"
        document.getElementById("rappel_libre").style.display = "none"
    }
    update_my_score()
    send_to_all_peers_nojson({is_courtier:peer.is_courtier}, SEND_UPDATE_DATA)

    send_to_all_peers_nojson({money:peer.money}, SEND_UPDATE_DATA)
}







function add_to_my_money(quantity){
    peer.money += quantity
    send_to_all_peers_nojson({money:peer.money}, SEND_UPDATE_DATA)
    //update mass money
    setTimeout(function(){update_mass_money()}, 2618)

}