
// Add an info box which only contains some text
// The info box is removed when the button is clicked
// The position (x,y) is the position on the screen
function add_info_simple(text, x , y){
    var info_div = document.createElement("div");
    info_div.classList.add('info_div');

    info_div.innerHTML = text;

    var button = document.createElement("button");
    button.classList.add('info_button_ok')
    button.innerHTML = "Ok";
    button.onclick = function () { info_div.remove()}
    info_div.appendChild(button);
    
    info_div.style.top = y;
    info_div.style.left = x;
    
    var plateau = document.getElementById("plateau_div")
    plateau.appendChild(info_div); 
}





function add_info_offer(card, sender, x,y) {
    var info_div = document.createElement("div");
    info_div.classList.add('info_div');

    info_div.innerHTML = sender.pseudo + " propose " + card_span(card) + " qui coute " + card_cost(card) ;

    var button_accept = document.createElement("button");
    button_accept.classList.add('info_button_ok')
    button_accept.innerHTML = "Ok";
    button_accept.onclick = function () { info_div.remove();
        if (peer.money >= card_cost(card)) {
            add_to_my_money(- card_cost(card))
            add_card(card)
            send_to_peer_nojson(card, SEND_ACCEPT, sender)
        }
        else {
            send_to_peer_nojson(card, SEND_NOT_ENOUGH_MONEY, sender)
        }
    }
    info_div.appendChild(button_accept);

    var button_decline = document.createElement("button");
    button_decline.classList.add('info_button_decline')
    button_decline.innerHTML = "Décliner";
    button_decline.onclick = function () { info_div.remove(); 
        send_to_peer_nojson(card, SEND_DECLINE, sender)}
    info_div.appendChild(button_decline);
    
    info_div.style.top = y;
    info_div.style.left = x;
    
    var plateau = document.getElementById("plateau_div")
    plateau.appendChild(info_div); 
}