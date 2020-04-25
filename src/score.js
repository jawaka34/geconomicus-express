score_chart = null

function update_my_score() {
    peer.score = 0
    for (var card of peer.cards) {
        peer.score += Math.pow(2, card.level)
    }
    send_to_all_peers_nojson({ score: peer.score }, SEND_UPDATE_DATA)
    update_score_chart()
}


function update_score_chart() {
    if ( peer != null ){
        var scores = [peer.score]
        var pseudos = [peer.pseudo]
        for (var c of connections) {
            if (c.open) {
                scores.push(c.score)
                pseudos.push(c.pseudo)
            }
        }
    
        score_chart.data.labels = pseudos;
        score_chart.data.datasets.forEach((dataset) => {
            dataset.data = scores
        });
        score_chart.update();
    }
    
}


function init_score_chart() {
    
    var scores = []
    var pseudos = []

    if ( peer != null ){
        scores.push(peer.score)
        pseudos.push(peer.pseudo)
    }
    
    for (var c of connections) {
        if (c.open) {
            scores.push(c.score)
            pseudos.push(c.pseudo)
        }
    }


    score_chart = new Chart(document.getElementById("score_chart"), {

        type: 'bar',
        data: {
            labels: pseudos,
            datasets: [
                {
                    backgroundColor: "#3e95cd",
                    data: scores
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: false,
            legend: { display: false },
            title: {
                display: true,
                text: 'Scores'
            }
        }
    });
}

init_score_chart()