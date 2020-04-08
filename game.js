



function print_my_money(ctx){
    ctx.fillStyle = "black"
    ctx.font = "30px Arial"
    ctx.fillText(my_data.money, 0, 450)
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


function points_print(ctx) {
    // background
    ctx.beginPath()
    ctx.fillStyle = "#f9f2ec"
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    // border
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(500, 0)
    ctx.lineTo(500, 500)
    ctx.lineTo(0, 500)
    ctx.lineTo(0, 0)
    ctx.stroke()

    for (var p of connections) {
        if (p.open){
            if (p.avatar == null) {
                ctx.beginPath()
                ctx.arc(p.x, p.y, point_radius, 0, 2 * Math.PI)
                ctx.fillStyle = "black"
                ctx.fill()
            }
            else {
                ctx.drawImage(avatars[p.avatar], p.x - 20, p.y - 20, 40, 40)
                if (p.is_courtier){
                    ctx.drawImage(img_chapeau, p.x - 10, p.y -48, 40, 40)
                }
            }
    
            ctx.font = "30px Arial"
            ctx.fillStyle = "black"
            ctx.fillText(p.pseudo, p.x + 10, p.y - 10)
        }
        
    }

    {

    var p = my_position
        if (my_avatar == null) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, point_radius, 0, 2 * Math.PI)
            ctx.fillStyle = "black"
            ctx.fill()
        }
        else {
            
            ctx.drawImage(avatars[my_avatar], p.x - 20, p.y - 20, 40, 40)
            if (is_courtier){
                ctx.drawImage(img_chapeau, p.x - 10, p.y -48, 40, 40)
            }
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

    var speed = 2
    var my_position_has_changed = false
    if (keyState[83] || keyState[40]) {
        if (my_position.y + speed < canvas.height) {
            positions_have_changed = true
            my_position_has_changed = true
            my_position.y += speed;  
        }
    }
    if (keyState[90] || keyState[38]) {
        if (my_position.y - speed > 0) {
            positions_have_changed = true
            my_position_has_changed = true
            my_position.y -= speed;
        }
    }
    if (keyState[37] || keyState[81]) {
        if (my_position.x - speed > 0) {
            positions_have_changed = true
            my_position.x -= speed;
            my_position_has_changed = true
        }
    }
    if (keyState[39] || keyState[68]) {
        if (my_position.x + speed < canvas.width) {
            positions_have_changed = true
            my_position_has_changed = true
            my_position.x += speed;    
        }
    }

    slide_little_card()
    points_print(ctx)
    print_my_cards(ctx)
    print_my_money(ctx)

    if ( my_position_has_changed){
        send_to_all_peers(my_position, "position")
    }

    if (positions_have_changed) {
        changevol()
    }

    if ( game.mode == MODE_LIBRE)
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

    if ( game.mode == MODE_DETTE ){
    
        ctx.drawImage(img_bank, bank_position.x -40, bank_position.y - 40, 80, 80)
        
        for ( i in my_credits){
            ctx.font = "16px Arial"
            ctx.fillStyle = "black"
            ctx.fillText("Crédit à rembourser dans : " + get_time_left_credit(my_credits[i]) + "s", 0,30 + i*30)

            if (get_time_left_credit(my_credits[i]) < 0){
                
                if ( my_data.money >= 4){
                    my_data.money -= 4
                    send_to_all_peers({money:my_data.money}, "update_money")
                    payer_interets()
                    my_credits.splice(i,1)
                }
                else if ( my_data.money >= 1){
                    my_data.money -= 1
                    send_to_all_peers({money:my_data.money}, "update_money")
                    my_credits.splice(i,1)
                    my_credits.push(get_current_time())
                    payer_interets()
                }
                else {
                    if ( my_cards.length >= 1){
                        my_credits.splice(i,1)
                        my_credits.push(get_current_time())
                        hypothequer(my_cards[0])
                        remove_card(my_cards[0])
                        send_to_all_peers({score: my_score}, "score")
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
    for (card of my_cards) {
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
    send_to_all_peers(game, "reset")
    reset_my_data()
}

function play_dette(){
    game.mode = MODE_DETTE
    game.turn = 0
    game.start_time = get_current_time()
    send_to_all_peers(game, "reset")
    reset_my_data()
}


function reset_my_data(){
    if ( game.mode == MODE_LIBRE){
        my_data.money = libre_money_init
        init_cards()
        my_credits = []
        is_courtier = false
    }
    else if (game.mode == MODE_DETTE){
        my_data.money = 0
        init_cards()
        my_credits = []
        is_courtier = false
    }
    update_my_score()
    send_to_all_peers({is_courtier:is_courtier}, "courtier")
    send_to_all_peers({score: my_score}, "score")
    send_to_all_peers({money:my_data.money}, "update_money")
}

