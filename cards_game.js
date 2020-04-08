
function add_card(card) {
    my_cards.push(card)
    update_my_score()
    reposition_cards()
}

function remove_card(card) {
    var i = find_card(card)
    my_cards.splice(i, 1)
    update_my_score()
    reposition_cards()
}


function find_card(obj) {
    for (var i in my_cards) {
        if (obj.letter == my_cards[i].letter && obj.level == my_cards[i].level && obj.bonus == my_cards[i].bonus) {
            return i
        }
    }
    return null
}


function init_cards() {
    my_cards = []
    for (var i = 0; i < nb_cards_init; i++) {

        var l = letters.length;
        new_card(letters.charAt(Math.floor(Math.random() * l)), Math.floor(Math.random() * 1), 0)
    }
    send_to_all_peers({ score: my_score }, "score")
}

init_cards()


function add_random_card(level) {
    var l = letters.length;
    new_card(letters.charAt(Math.floor(Math.random() * l)), level, 0)
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
    my_cards.sort(compare_cards)
    let nb_cards_max_on_line = Math.floor(500 / card_width) - 2
    for (var i in my_cards) {
        my_cards[i].target_x = 40 + (i % nb_cards_max_on_line) * (my_cards[i].w + 2)
        my_cards[i].target_y = 430 - Math.floor((i / nb_cards_max_on_line)) * card_height
    }
}



function print_my_cards(ctx) {
    for (var card of my_cards) {
        ctx.beginPath();
        ctx.fillStyle = cards_color[card.level];
        ctx.rect(card.x, card.y, card.w, card.h);
        ctx.fill();

        ctx.fillStyle = "black"
        ctx.font = "30px Arial";
        ctx.fillText(card.letter, card.x + 3, card.y + 25);
    }
}


function slide_little_card() {
    for (var card of my_cards) {
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
        remove_cards(square, square_size)
        for (var i = 0; i < square_size; i++) {
            add_random_card(square.level)
        }
        add_random_card(square.level + 1)
        send_to_all_peers({ score: my_score }, "score")
    }
    else {
        return
    }

}


function check_for_square() {
    var tab = []
    for (var card of my_cards) {
        if (tab[card.level] == null) {
            tab[card.level] = []
        }

        if (tab[card.level][card.letter] == null) {
            tab[card.level][card.letter] = 1
        } else {
            tab[card.level][card.letter] += 1
            if (tab[card.level][card.letter] >= square_size) {
                return { level: card.level, letter: card.letter }
            }
        }
    }
    return null
}


function remove_cards(square, nb) {
    for (var j = 0; j < nb; j++) {
        for (var i in my_cards) {
            if (my_cards[i].level == square.level && my_cards[i].letter == square.letter) {

                remove_card(my_cards[i])
                break
            }
        }
    }

}