my_cards = []
my_money = 4
card_selected = null


cards_color = ["#ff4d4d", "#e6e600", "#33ff99", "#80ccff"]

function get_random_card(level) {

}

function init_cards() {
    my_cards = []
    for (i = 0; i < 7; i++) {
        var characters = "ABCDEFGHIJKLM";
        var l = characters.length;
        new_card(characters.charAt(Math.floor(Math.random() * l)), Math.floor(Math.random() * 4), 0)
    }    

}

init_cards()


function new_card(letter, level, bonus) {
    var card = { letter: letter, level: level, bonus: bonus, selected: false }
    var l = my_cards.length
    card.x = 0
    card.target_x = 0
    card.y = 0
    card.target_y = 0
    card.w = 48
    card.h = 70
    my_cards.push(card)
    reposition_cards()
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
    for (i in my_cards) {
        my_cards[i].target_x = 30+i * 50
        my_cards[i].target_y = 430
    }
}



function print_my_cards(ctx) {

    ctx.fillStyle = "black"
    ctx.font = "30px Arial";
    ctx.fillText(my_money, 0, 450);

    for (card of my_cards) {
        ctx.beginPath();
        ctx.fillStyle = cards_color[card.level];
        ctx.rect(card.x, card.y, 48, 70);
        ctx.fill();

        ctx.fillStyle = "black"
        ctx.font = "30px Arial";
        ctx.fillText(card.letter, card.x + 3, card.y + 25);
    }
}


function slide_little_card(){
    for (card of my_cards){
        var target = {x:card.target_x, y:card.target_y}
        var d = distance(card, target)
        
        if ( d <= 3){
            card.x = target.x
            card.y = target.y
        }else {
            
            card.x += (target.x - card.x) *5 / d
            card.y += (target.y - card.y) *5/ d
        }
    }
    
}


