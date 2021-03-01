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

avatars_data = [
    {left: "img/hen_left.png",
    right: "img/hen_right.png"},
    {left: "img/baleine_left.png",
    right: "img/baleine_right.png"},
    {left: "img/cow_left.png",
    right: "img/cow_right.png"},
    {left: "img/duck_left.svg",
    right: "img/duck_right.svg"},
    {left: "img/horse_left.svg",
    right: "img/horse_right.svg"},
    {left: "img/lion_left.png",
    right: "img/lion_right.png"},
    {left: "img/ours_left.png",
    right: "img/ours_right.png"},
    {left: "img/pig_left.png",
    right: "img/pig_right.png"},
    {left: "img/rabbit_left.png",
    right: "img/rabbit_right.png"},
    {left: "img/racoon_left.png",
    right: "img/racoon_right.png"},
    {left: "img/cat_left.png",
    right: "img/cat_right.png"},
    {left: "img/dog_left.png",
    right: "img/dog_right.png"}
]

// avatars are loaded in the variable 'avatars'
for (var a of avatars_data) {
    var img_left = new Image()
    img_left.src = a.left
    a.left_img = img_left

    var img_right = new Image()
    img_right.src = a.right
    a.right_img = img_right
}

my_avatar = Math.floor(Math.random() * avatars_data.length)

img_bank = new Image()
img_bank.src = "img/bank.svg"

img_chapeau = new Image()
img_chapeau.src = "img/chapeau.png"

img_coin = new Image()
img_coin.src = "img/coin.png"





