function envoyer_message(){
    var msg = document.getElementById("message").value
    document.getElementById("message").value = ""
    ajouter_message_au_chat_new(peer, msg)
    send_to_all_peers_nojson({ message: msg }, SEND_MESSAGE)
}

function ajouter_message_au_chat_new(c,msg){
    document.getElementById("chat_new").innerHTML += '<br><img width="20px" src="' + avatars_data[c.avatar].right + '"/><b>' + c.pseudo + "</b> : " + msg
    document.getElementById('chat_new').scrollTop = document.getElementById('chat_new').scrollHeight;
}

function ajouter_message_au_chat2(msg){
    document.getElementById("chat2").value += "\n"  + msg
    var textarea = document.getElementById('chat2');
    textarea.scrollTop = textarea.scrollHeight;
}

function vider_chat2(){
    document.getElementById("chat2").value = ""
}

function vider_chat_new(msg){
    document.getElementById("chat_new").innerHTML = msg
}

function vider_chat_debug(msg){
    document.getElementById("chat_debug").value = msg
}

function ajouter_message_au_chat_debug(msg){
    document.getElementById("chat_debug").value += "\n"  + msg
    document.getElementById('chat_debug').scrollTop = document.getElementById('chat_debug').scrollHeight;
}