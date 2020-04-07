// PEER
peer = null
connections = []

// GAME PERSO DATA
my_money = 4
my_position = { x: Math.floor(Math.random()*400), y: Math.floor(Math.random()*400) }
pseudo = "Guest"
my_avatar = null
my_cards = []


card_selected = null
positions_have_changed = false

// SCREEN PARAMS
const point_radius = 20
const card_width = 30
const card_height = 70
avatars = []
const cards_color = ["#ff4d4d", "#e6e600", "#33ff99", "#80ccff"]

// GAME PARAMS
const square_size = 2
const nb_cards_init = 4
const letters = "ABCDEFEGHIJKLM"

function card_cost(card){
    return Math.pow(2,card.level)
}

function june_reevaluation(x){
    x = Math.floor(x/2) + 8
}

const reevaluation_period = 60*4 // 4 minutes
start_time = get_current_time()

function get_current_time(){
    var d = new Date()
    return d.getTime()
}