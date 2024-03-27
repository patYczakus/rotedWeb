const cards = [4, 4, 5, 6, 7, 6]

var matchData = {
    diceCards: -1,
    constRulesIDs: [],
    onetimeRulesIDs: [],
}

var elements = {
    cardsInfo: () => document.getElementById("cards"),
    crulesInfo: () => document.getElementById("const_rules"),
    otrulesInfo: () => document.getElementById("onetime_rules"),
    changeRulesDiv: () => document.getElementById("changeRules"),
}

window.addEventListener("DOMContentLoaded", () => {
    matchData.diceCards = Math.floor(Math.random() * 6)

    var ID = -1
    for (var i = 0; i < Math.ceil(rules.length / 6); i++) {
        for (var j = 0; j < Math.floor(Math.random() * 6) + 1; j++) {
            var canAdd = false
            do {
                ID = (ID + 1) % rules.length
                canAdd =
                    !matchData.constRulesIDs.includes(ID) &&
                    matchData.constRulesIDs.filter((x) => rules[ID].requiredRules.includes(x)).length === rules[ID].requiredRules.length &&
                    matchData.constRulesIDs.filter((x) => rules[ID].blockingRules.includes(x)).length === 0
            } while (!canAdd)
        }
        matchData.constRulesIDs.push(ID)
    }

    elements.crulesInfo().innerHTML = matchData.constRulesIDs
        .map((x) => {
            if (rules[x].addtionalInfo === null) var btn = ""
            else var btn = `<button type="button" class="getAddtionalInfo" rid="${x}">Info</button>`
            return `<b>${x + 1}.</b> ${rules[x].description} ${btn}`
        })
        .join("<br />")
    elements.otrulesInfo().innerHTML = "[ brak ]"

    document.querySelector("button#endedRound").addEventListener("click", () => {
        show("menu")
    })
    document.querySelectorAll("button.getAddtionalInfo").forEach((x) => {
        x.addEventListener("click", () => {
            alert(`DO ZASADY NR. ${Number(x.attributes.getNamedItem("rid").value) + 1}\n\n${rules[Number(x.attributes.getNamedItem("rid").value)].addtionalInfo}`)
        })
    })

    ticker()
})

function ticker() {
    elements.cardsInfo().innerHTML = `Rzucona ilość kością: <b>${matchData.diceCards + 1}</b><br />Ilość kart: <b>${cards[matchData.diceCards]}</b>`
    if (matchData.diceCards == 5) elements.cardsInfo().innerHTML += `<br /><i>Przed zaczęciem wyrzucania kart powinno się dawać po jednej karcie dla przeciwnika.</i>`

    requestAnimationFrame(ticker)
}

function show(type) {
    if (elements.changeRulesDiv().classList.contains("hidden")) elements.changeRulesDiv().classList.remove("hidden")
    if (!document.querySelector("#info").classList.contains("hidden")) document.querySelector("#info").classList.add("hidden")
    switch (type) {
        default:
            elements.changeRulesDiv().innerHTML = `<button type="button" class="option">Zmień ilość oczek</button><br />
            <button type="button" class="option" disabled>Zmień stałą zasadę</button>`
            document.querySelectorAll("button.option")[0].addEventListener("click", () => {
                matchData.diceCards = Math.floor(Math.random() * 6)
                hide()
            })
            break
        case "changeConstRule":
    }
}

function hide() {
    if (!elements.changeRulesDiv().classList.contains("hidden")) elements.changeRulesDiv().classList.add("hidden")
    if (document.querySelector("#info").classList.contains("hidden")) document.querySelector("#info").classList.remove("hidden")
}
