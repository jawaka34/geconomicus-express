score_chart = null
monetary_mass_chart = null
monetary_mass_historic_counter = []
mmhc = 0
monetary_mass_historic = []

function init_monetary_mass_historic(){
    monetary_mass_historic_counter = []
    mmhc = 0
    monetary_mass_historic = []
}

function init_monetary_mass_chart(){
    monetary_mass_chart = new Chart(document.getElementById("monetary_mass_chart"), {
        type: 'line',
        data: {fill: false,
            datasets: [ 
            {
                borderColor: "#ff0000",
                data: monetary_mass_historic }
        ]},
        options: {
            responsive: false,
            legend: { display: false },
            elements: {
                point:{
                    radius: 0
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Évolution de la masse monétaire'
            }
        }
    });
}

init_monetary_mass_chart()

function update_monetary_mass_chart() {
    if ( peer != null ){
        monetary_mass_chart.data.labels = monetary_mass_historic_counter;
        monetary_mass_chart.data.datasets.forEach((data) => {
            data.data = monetary_mass_historic
        });
        //monetary_mass_chart.update()
    }

}

function update_my_score() {
    peer.score = 0
    for (var card of peer.cards) {
        peer.score += Math.pow(2, card.level)
    }
    send_to_all_peers_nojson({ score: peer.score }, SEND_UPDATE_DATA)
    update_score_chart()
}


setInterval(function () { update_mass_money() }, 1000);

function update_mass_money() {

        if ( peer != null ){
            var massmoney = peer.money
            for (var c of connections) {
                if (c.open) {
                    massmoney = massmoney + c.money
                }
            }
            monetary_mass_historic.push(massmoney)
            monetary_mass_historic_counter.push(mmhc)
            mmhc += 1
        }
    update_monetary_mass_chart()
    
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
        score_chart.update()
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
