// Avatars file names. It could be possible to load automatically all the images of a directory 'avatars'
// Avatars can be png or svg. They are automatically resized when printed.
avatars_file_names = [
    "img/hen.png",
    "img/pig.png",
    "img/cow.png",
    "img/horse.svg",
    "img/duck.svg",
    "img/frog.svg",
    "img/racoon.png",
    "img/baleine.png",
    "img/ours.png",
    "img/rabbit.png",
    "img/lion.png"
]

// avatars are loaded in the variable 'avatars'
for (var file_name of avatars_file_names) {
    var img = new Image()
    img.src = file_name
    avatars.push(img)
}


my_avatar = Math.floor(Math.random() * avatars.length)

img_bank = new Image()
img_bank.src = "img/bank.svg"

img_chapeau = new Image()
img_chapeau.src = "img/chapeau.png"

img_coin = new Image()
img_coin.src = "img/coin.png"





