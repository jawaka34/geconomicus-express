debug = false

// PEER
peer = null
connections = []

const SEND_UPDATE_DATA_NO_RECONNECTION = 1
const SEND_PEER = 2
const SEND_OFFER = 3
const SEND_ACCEPT = 4
const SEND_DECLINE = 5
const SEND_NOT_ENOUGH_MONEY = 6
const SEND_INTERETS = 10
const SEND_HYPOTHEQUE = 11
const SEND_RECONNECTION = 15
const SEND_UPDATE_DATA = 17
const SEND_PEERS_LIST = 18
const SEND_MESSAGE = 19
const SEND_PEERS_DATA_RESUME = 20
const SEND_ASK_DEBUG_DATA = 21
const SEND_UPDATE_GAME_PARAMS = 22
const SEND_INIT_STUFF = 23
const SEND_UPDATE_CREDITS_TIME = 24

// BULLE INFO
infos = []

const INFO_TYPE_TEXT = 0
const INFO_TYPE_CARD = 1



// GAME PERSO DATA


my_credits = []




card_selected = null
positions_have_changed = false

// SCREEN PARAMS
move_target = null // it is the target point for moving the avatar
const point_radius = 20
const card_width = 30
const card_height = 70

const cards_color = ["#ff4d4d", "#e6e600", "#33ff99", "#80ccff"]

bank = {x:400, y:100}
fabrik = {x:100, y:100}
peer_selected = null

const DIR_LEFT = true
const DIR_RIGHT = false


function card_cost(card){
   return game.low_price*Math.pow(2,card.level)
}




const MODE_LIBRE = 0
const MODE_DETTE = 1
const MODE_WAITING_ROOM = 2
const MODE_DON = 3

const GAME_STATUS_RUNNING = 0
const GAME_STATUS_PAUSED = 1
const GAME_STATUS_OVER = 2
game = {}




function distance(p, q) {
    return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y))
}

function vector(a,b){
   return {x : b.x - a.x , y: b.y - a.y}
}

function ps(a,b){
   return a.x * b.x + a.y * b.y
}
