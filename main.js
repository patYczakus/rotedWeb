const cards = [4, 4, 5, 6, 7, 6]

var matchData = {
    diceCards: -1,
    constRulesIDs: [],
    onetimeRulesIDs: [],
}

var elements = {
    cardsInfo: () => document.getElementById("cards"),
    crulesInfo: () => document.getElementById("const_rules"),
    // otrulesInfo: () => document.getElementById("onetime_rules"),
    changeRulesDiv: () => document.getElementById("changeRules"),
}

function changeRulesShow() {
    elements.crulesInfo().innerHTML = matchData.constRulesIDs
        .map((x) => {
            if (rules[x].addtionalInfo === null) var btn = ""
            else var btn = `<button type="button" class="getAddtionalInfo" rid="${x}">Info</button>`
            return `<b>${x + 1}.</b> ${rules[x].description} ${btn}`
        })
        .join("<br />")
    // elements.otrulesInfo().innerHTML = "[ brak ]"

    document.querySelector("button#endedRound").addEventListener("click", () => {
        show("menu")
    })
    document.querySelectorAll("button.getAddtionalInfo").forEach((x) => {
        x.addEventListener("click", () => {
            alert(`DO ZASADY NR. ${Number(x.attributes.getNamedItem("rid").value) + 1}\n\n${rules[Number(x.attributes.getNamedItem("rid").value)].addtionalInfo}`)
        })
    })
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

    changeRulesShow()

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
            <button type="button" class="option">Zmień stałą zasadę</button>`
            document.querySelectorAll("button.option")[0].addEventListener("click", () => {
                matchData.diceCards = Math.floor(Math.random() * 6)
                hide()
            })
            document.querySelectorAll("button.option")[1].addEventListener("click", () => {
                show("changeConstRule")
            })
            break
        case "changeConstRule":
            elements.changeRulesDiv().innerHTML = ""
            for (let i = 0; i < rules.length; i++) {
                var btn = document.createElement("button")
                btn.className = "ruleBtn"
                if (
                    (matchData.constRulesIDs.filter((x) => rules[i].requiredRules.includes(x)).length === rules[i].requiredRules.length &&
                        matchData.constRulesIDs.filter((x) => rules[i].blockingRules.includes(x)).length === 0) ||
                    matchData.constRulesIDs.includes(i)
                )
                    if (matchData.constRulesIDs.includes(i))
                        if (matchData.constRulesIDs.length > 1) {
                            btn.addEventListener("click", function () {
                                matchData.constRulesIDs = matchData.constRulesIDs.filter((id) => id !== i)
                                changeRulesShow()
                                hide()
                            })
                            btn.innerText = "Dezaktywuj"
                        } else {
                            btn.disabled = true
                            btn.innerText = "Dezaktywacja niemożliwa"
                        }
                    else {
                        btn.addEventListener("click", function () {
                            matchData.constRulesIDs.push(i)
                            changeRulesShow()
                            hide()
                        })
                        btn.innerText = "Aktywuj"
                    }
                else {
                    btn.disabled = true
                    btn.innerText = "Aktywacja niemożliwa"
                }

                var h2 = document.createElement("h2")
                h2.innerText = `Zasada nr. ${i + 1} `
                h2.appendChild(btn)

                var desc = document.createElement("div")
                desc.innerHTML = `${rules[i].description}${
                    rules[i].requiredRules.length > 0 ? `<br /><i>Potrzebne zasady: <b>${rules[i].requiredRules.map((j) => j + 1).join(", ")}</b></i>` : ""
                }${rules[i].blockingRules.length > 0 ? `<br /><i>Wykluczające zasady: <b>${rules[i].blockingRules.map((j) => j + 1).join(", ")}</b></i>` : ""}${
                    rules[i].addtionalInfo !== null ? "<br />" : ""
                }`

                if (rules[i].addtionalInfo !== null) {
                    var aibtn = document.createElement("button")
                    aibtn.className = "getAddtionalInfo"
                    aibtn.addEventListener("click", () => {
                        alert(`DO ZASADY NR. ${i + 1}\n\n${rules[i].addtionalInfo}`)
                    })
                    aibtn.innerText = "Info"
                    desc.appendChild(aibtn)
                }

                var maindiv = document.createElement("div")
                maindiv.appendChild(h2)
                maindiv.appendChild(desc)

                elements.changeRulesDiv().appendChild(maindiv)
            }
    }
}

function hide() {
    if (!elements.changeRulesDiv().classList.contains("hidden")) elements.changeRulesDiv().classList.add("hidden")
    if (document.querySelector("#info").classList.contains("hidden")) document.querySelector("#info").classList.remove("hidden")
}
