






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
        if (p.avatar == null) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, point_radius, 0, 2 * Math.PI)
            ctx.fillStyle = "black"
            ctx.fill()
        }
        else {
            ctx.drawImage(avatars[p.avatar], p.x - 20, p.y - 20, 40, 40)
        }

        ctx.font = "30px Arial"
        ctx.fillStyle = "black"
        ctx.fillText(p.pseudo, p.x + 10, p.y - 10)
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
        }


        /*
        ctx.font = "30px Arial"
        ctx.fillStyle = "black"
        ctx.fillText(pseudo, p.x, p.y)
        */
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
    if (keyState[83]) {
        if (my_position.y + speed < canvas.height) {
            positions_have_changed = true
            my_position_has_changed = true
            my_position.y += speed;  
        }
    }
    if (keyState[90]) {
        if (my_position.y - speed > 0) {
            positions_have_changed = true
            y_position_has_changed = true
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
            y_position_has_changed = true
            my_position.x += speed;    
        }
    }

    slide_little_card()
    points_print(ctx)
    print_my_cards(ctx)

    if ( my_position_has_changed){
        send_to_all_peers(my_position, "position")
    }

    if (positions_have_changed) {
        changevol()
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






function distance(p, q) {
    return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y))
}