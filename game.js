point_radius = 5






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
    ctx.clearRect(0, 0, 500, 500)

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
        ctx.fill()
        ctx.font = "30px Arial";

        ctx.fillText(p.peer, p.x, p.y);
    }

    for (p of points) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, point_radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.font = "30px Arial";

        ctx.fillText("me", p.x, p.y);
    }

}