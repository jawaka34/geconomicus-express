
function add_card(card) {
    peer.cards.push(card)
    send_to_all_peers_nojson({cards: peer.cards}, SEND_UPDATE_DATA)
    update_my_score()
    reposition_cards()
}

function remove_card(card) {
    var i = find_card(card)
    peer.cards.splice(i, 1)
    send_to_all_peers_nojson({cards: peer.cards}, SEND_UPDATE_DATA)
    update_my_score()
    reposition_cards()
}


function find_card(obj) {
    for (var i in peer.cards) {
        if (obj.letter == peer.cards[i].letter && obj.level == peer.cards[i].level && obj.bonus == peer.cards[i].bonus) {
            return i
        }
    }
    return null
}


function init_cards() {
    peer.cards = []
    for (var i = 0; i < game.nb_cards_init; i++) {
        add_random_card(0)
    }
}



function add_random_card(level) {
    var l = game.letters.length;
    
    var bonus = 0
    if (game.common_good_mode){
        var r = Math.random()
        if ( r < game.common_good_proba_m1 ) {
            bonus = -1
        }
        else if ( r > 1 - game.common_good_proba_p1) {
            bonus = +1
        }
    }
    new_card(game.letters.charAt(Math.floor(Math.random() * l)), level, bonus)
}


function new_card(letter, level, bonus) {
    var card = { letter: letter, level: level, bonus: bonus, selected: false }
    card.x = 0
    card.target_x = 0
    card.y = 0
    card.target_y = 0
    card.w = card_width
    card.h = card_height

    add_card(card)

}

function compare_cards(a, b) {
    if (a.level < b.level) {
        return -1
    }
    else if (a.level > b.level) {
        return 1
    }
    else {
        if (a.letter < b.letter) {
            return -1
        }
        else if (a.letter > b.letter) {
            return 1
        }
        else {
            return 0
        }
    }

}

function reposition_cards() {
    peer.cards.sort(compare_cards)
    let nb_cards_max_on_line = Math.floor(500 / card_width) - 2
    for (var i in peer.cards) {
        peer.cards[i].target_x = 40 + (i % nb_cards_max_on_line) * (peer.cards[i].w + 2)
        peer.cards[i].target_y = 430 - Math.floor((i / nb_cards_max_on_line)) * card_height
    }
}


function print_card(card) {
    ctx.beginPath();
    ctx.fillStyle = cards_color[card.level];
    ctx.rect(card.x, card.y, card.w, card.h);
    ctx.fill();

    ctx.fillStyle = "black"
    ctx.font = "30px Arial";
    ctx.fillText(card.letter, card.x + 3, card.y + 25);

    if (card.bonus != 0){
        ctx.fillText(card.bonus, card.x + 3, card.y + 50)
    }
}

function print_my_cards(ctx) {
    for (var card of peer.cards) {
        print_card(card)
    }
}


function slide_little_card() {
    if (peer == null)
        return
    for (var card of peer.cards) {
        var target = { x: card.target_x, y: card.target_y }
        var d = distance(card, target)

        if (d <= 3) {
            card.x = target.x
            card.y = target.y
        } else {

            card.x += (target.x - card.x) * 5 / d
            card.y += (target.y - card.y) * 5 / d
        }
    }
}

function search_and_apply_square() {

    var square = check_for_square()
    if (square != null) {
        remove_cards(square, game.square_size)
        for (var i = 0; i < game.square_size; i++) {
            add_random_card(square.level)
        }
        add_random_card(square.level + 1)

    }
    else {
        return
    }
}

function count_cards_of_type(type){
    var counter = 0
    peer.cards.forEach((card) => {
        if (card.letter == type.letter && card.level == type.level){
            counter += 1
        }
    })
    return counter
}


function check_for_square() {
    var tab = []
    for (var card of peer.cards) {
        if (tab[card.level] == null) {
            tab[card.level] = []
        }

        if (tab[card.level][card.letter] == null) {
            tab[card.level][card.letter] = 1
        } else {
            tab[card.level][card.letter] += 1
            if (tab[card.level][card.letter] >= game.square_size) {
                return { level: card.level, letter: card.letter }
            }
        }
    }
    return null
}


function remove_cards(square, nb) {
    var initial_health = game.common_good_health
    for (var j = 0; j < nb; j++) {
        // remove in priority max bonus cards
        var max_bonus = -10
        var max_i = -1
        for (var i in peer.cards) {
            if (peer.cards[i].level == square.level && peer.cards[i].letter == square.letter) {
                if (peer.cards[i].bonus > max_bonus){
                    max_bonus = peer.cards[i].bonus
                    max_i = i
                }
            }
        }
        console.log(max_bonus)
        console.log(max_i)
        game.common_good_health += max_bonus
        remove_card(peer.cards[max_i])
    }
    if ( initial_health != game.common_good_health){
        send_to_all_peers_nojson(game, SEND_UPDATE_GAME_PARAMS)
    }

}

function remove_random_card(){
    if ( peer.cards.length > 0){
        var i = Math.floor(Math.random()*peer.cards.length)
        peer.cards.splice(i,1)
    }
}