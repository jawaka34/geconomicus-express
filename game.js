point_radius = 10
canvas_width = 500
canvas_height = 500





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


    ctx.beginPath()
    ctx.fillStyle = "#f9f2ec"
    ctx.rect(0, 0, canvas_width, canvas_height);
    ctx.fill();


    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(500, 0)
    ctx.lineTo(500, 500)
    ctx.lineTo(0, 500)
    ctx.lineTo(0, 0)
    ctx.stroke()

    for (p of connections) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, point_radius, 0, 2 * Math.PI)
        ctx.fillStyle = "black"
        ctx.fill()

        ctx.font = "30px Arial";
        ctx.fillStyle = "black"
        ctx.fillText(p.pseudo, p.x, p.y);
    }

    for (p of points) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, point_radius, 0, 2 * Math.PI)
        ctx.fillStyle = "black"
        ctx.fill()

        ctx.font = "30px Arial";
        ctx.fillStyle = "black"
        ctx.fillText(pseudo, p.x, p.y);
    }

    print_my_cards(ctx)
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
    if (keyState[83]) {
        points[0].y += speed;
        send_to_all_peers(points[0], "position")
    }
    if (keyState[90]) {
        points[0].y -= speed;
        send_to_all_peers(points[0], "position")
    }
    if (keyState[37] || keyState[81]) {
        points[0].x -= speed;
        send_to_all_peers(points[0], "position")
    }
    if (keyState[39] || keyState[68]) {
        points[0].x += speed;
       
        send_to_all_peers(points[0], "position")
        
    }

    slide_little_card()
   
    points_print(ctx)
    changevol()

    
}






function distance(p, q) {
    return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y))
}