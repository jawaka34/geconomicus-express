function envoyer_message(){
    var msg = document.getElementById("message").value
    document.getElementById("message").value = ""
    ajouter_message_au_chat(peer, msg)
    send_to_all_peers_nojson({ message: msg }, SEND_MESSAGE)
}

function ajouter_message_au_chat(c,msg){
    document.getElementById("chat").value += "\n" + c.pseudo + " : " + msg
    var textarea = document.getElementById('chat');
    textarea.scrollTop = textarea.scrollHeight;
}

function ajouter_message_au_chat2(msg){
    document.getElementById("chat2").value += "\n"  + msg
    var textarea = document.getElementById('chat2');
    textarea.scrollTop = textarea.scrollHeight;
}

function vider_chat2(){
    document.getElementById("chat2").value = ""
}

function vider_chat(msg){
    document.getElementById("chat").value = msg
}

function vider_chat3(msg){
    document.getElementById("chat3").value = msg
}