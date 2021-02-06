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