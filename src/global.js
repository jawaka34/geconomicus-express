// PEER
peer = null
connections = []

const SEND_POSITION = 0
const SEND_PSEUDO = 1
const SEND_PEER = 2
const SEND_OFFER = 3
const SEND_ACCEPT = 4
const SEND_DECLINE = 5
const SEND_NOT_ENOUGH_MONEY = 6
const SEND_AVATAR = 7
const SEND_GAME = 8
const SEND_UPDATE_COURTIER = 9
const SEND_INTERETS = 10
const SEND_HYPOTHEQUE = 11
const SEND_RESET = 12
const SEND_UPDATE_SCORE = 13
const SEND_UPDATE_MONEY = 14

// BULLE INFO
infos = []



// GAME PERSO DATA

my_data = {
    x: Math.floor(Math.random() * 400),
    y: Math.floor(Math.random() * 400),
    pseudo: "Joueur",
    avatar: null,
    courtier: false,
    score: 0,
    money: 0,
    cards: [],
    credits: []
}

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
peer_selected = null

// GAME PARAMS
 square_size = 3
 nb_cards_init = 6 
 letters = "ABCDEFEGHIJKLM"

function card_cost(card){
    if ( game.mode == MODE_LIBRE)
        return 6*Math.pow(2,card.level)
    else 
        return 2*Math.pow(2,card.level)
}

const reevaluation_period = 4*60 // 4 minutes
const credit_period = 4*60
const libre_money_init = 8
const dette_money_init = 0



const MODE_LIBRE = 0
const MODE_DETTE = 1
game = {mode:MODE_DETTE, start_time:0, turn: 0}



function update_rules(){
    var player_count = 0
    for ( var c of connections){
        if (c.open){
            player_count ++
        }
    }

    if ( player_count >= 10){
        square_size = 4
        nb_cards_init = 4 
       letters = "ABCDEFEGHIJKLM"
    } else if ( player_count == 8 || player_count == 9){
        square_size = 4
        nb_cards_init = 5 
       letters = "ABCDEFEGHIJKLM"
    }
    else if ( player_count == 7){
        square_size = 4
        nb_cards_init = 5 
       letters = "ABCDEFEGHIJK"
    }
    else if ( player_count == 6){
        square_size = 4
        nb_cards_init = 6 
       letters = "ABCDEFEGHIJK"
    }
    else if ( player_count == 5){
        square_size = 3
        nb_cards_init = 5
       letters = "ABCDEFEGHIJK"
    }
    else if ( player_count == 4){
        square_size = 3
        nb_cards_init = 6
       letters = "ABCDEFEGHIJK"
    }
    else if ( player_count  < 4){
        square_size = 3
        nb_cards_init = 8
       letters = "ABCDEFEGHIJK"
    }
     
}


function distance(p, q) {
    return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y))
}
