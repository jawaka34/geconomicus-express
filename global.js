// PEER
peer = null
connections = []

// GAME PERSO DATA
my_money = 0
my_position = { x: Math.floor(Math.random()*400), y: Math.floor(Math.random()*400) }
my_pseudo = "Guest"
my_avatar = null
my_cards = []
my_credits = []
is_courtier = false
my_score = 0


card_selected = null
positions_have_changed = false

// SCREEN PARAMS
const point_radius = 20
const card_width = 30
const card_height = 70
avatars = []
const cards_color = ["#ff4d4d", "#e6e600", "#33ff99", "#80ccff"]

const bank_position = {x:400, y:100}

// GAME PARAMS
const square_size = 2
const nb_cards_init = 4
const letters = "ABCDEFEGHIJKLM"

function card_cost(card){
    if ( game.mode == MODE_LIBRE)
        return 6*Math.pow(2,card.level)
    else 
        return 2*Math.pow(2,card.level)
}

const reevaluation_period = 10 // 4 minutes
const credit_period = 5
const libre_money_init = 8
const dette_money_init = 0



const MODE_LIBRE = 0
const MODE_DETTE = 1
game = {mode:MODE_DETTE, start_time:0, turn: 0}

if ( game.mode == MODE_DETTE){
    my_money = dette_money_init
}
else if ( game.mode == MODE_LIBRE){
    my_money = libre_money_init
}



function distance(p, q) {
    return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y))
}
