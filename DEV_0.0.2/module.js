const SUITS = ["♥️", "♣️", "♦️", "♠️"]
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
const JOCKERS = ["Red", "Black", "Blue"]

const PlayerDeck = [4, 4, 5, 6, 7, 6]

var loc = "conf"

class Card {
    constructor(val, suit) {
        this.isJoker = val.toLowerCase() == "joker"

        var cardHTML = document.createElement("button")
        cardHTML.className = "card"
        var cardSuitHTML = document.createElement("div")
        cardSuitHTML.className = "suit"
        if (!this.isJoker) {
            cardSuitHTML.innerText = suit
        } else {
            cardSuitHTML.innerText = "🃏"
            cardHTML.classList.add("joker")
        }
        if (suit === "Red" || suit === "♥️" || suit === "♦️") cardSuitHTML.style.color = "red"
        if (suit === "Blue") cardSuitHTML.style.color = "blue"
        var cardValHTML = document.createElement("div")
        cardValHTML.className = "value"
        cardValHTML.innerText = val
        cardHTML.appendChild(cardValHTML)
        cardHTML.appendChild(cardSuitHTML)

        this.value = val
        this.suit = suit
        this.HTMLElement = cardHTML
    }
}

class Deck {
    constructor(cards) {
        this.cards = cards
    }

    get counts() {
        return this.cards.length
    }

    pop() {
        var card = this.cards.shift()
        return card
    }

    push(card) {
        return this.cards.push(card)
    }

    shuffle() {
        this.cards.sort(() => Math.random() - 0.3)
        return this
    }
}

function freshDeck() {
    var v = VALUES.flatMap((val) => SUITS.map((suit) => new Card(val, suit)))
    JOCKERS.forEach((jock) => v.push(new Card("JOKER", jock)))

    var x = []
    for (var i = -2; i < Math.floor(playersNames.length / 7); i++) {
        x = x.concat(v)
    }
    return x
}

// ----------------------------------------------------------------

/**
 * @type {{ deck: Card[], info: string[], blocks: number }[]}
 */
var playersInfo = []
var playersNames = ["A", "B"]

var gameDefinition = {
    deck: new Deck([]),
    /**
     * @type {Card[]}
     */
    placed: [],
    playerDeckType: 5,
    whichPlayerToPlay: -1,
    modifiers: [],
    /**
     * @type {[boolean, boolean, number]}
     */
    code: [false, false, 0],
}

function startNewMatch(newGame = true) {
    loc = "game"

    console.log(freshDeck().length)
    gameDefinition.deck = new Deck(freshDeck()).shuffle()
    if (newGame) {
        for (let i = 0; i < Math.ceil(changableRules.length / 6); i++) {
            for (let j = 0; j < Math.floor(Math.random() * 6); j++) {
                if (
                    changableRules[j % changableRules.length].requiredRules.filter((rule) => gameDefinition.modifiers.includes(rule)).length ===
                        changableRules[j % changableRules.length].requiredRules.length &&
                    changableRules[j % changableRules.length].blockingRules.filter((rule) => gameDefinition.modifiers.includes(rule)).length < 1
                ) {
                    gameDefinition.modifiers.push(j)
                } else {
                    j--
                }
            }
        }

        gameDefinition.playerDeckType = Math.floor(Math.random() * 6)
        gameDefinition.whichPlayerToPlay = Math.floor(Math.random() * playersNames.length)
        if (gameDefinition.playerDeckType == 5) gameDefinition.code = [true, false, playersNames.length]
    }

    for (let i = 0; i < playersNames.length; i++) {
        playersInfo[i] = { deck: [], info: [], blocks: 0, innumiteSayed: false }
    }

    document.body.innerHTML = `<div id="playerInfo"></div><div id="placedCards"></div>`

    for (let j = 0; j < PlayerDeck[gameDefinition.playerDeckType]; j++) {
        for (let i = 0; i < playersNames.length; i++) {
            playersInfo[i].deck.push(gameDefinition.deck.pop())
            //console.log(i, j)
        }
    }

    const firstcard = gameDefinition.deck.pop()
    //console.log(firstcard)
    gameDefinition.placed.push(firstcard)
    document.querySelector("body #placedCards").appendChild(firstcard.HTMLElement)

    generateInfo(gameDefinition.whichPlayerToPlay)
}

/**
 *
 * @param {number} player
 * @param {boolean} show
 */
function generateInfo(player, show = false) {
    var playerInfoH = document.createElement("h1")
    if (gameDefinition.code[0] && !gameDefinition.code[1]) playerInfoH.innerText = `${playersNames[player]}, przekaż kartę dla następnego gracza!`
    else playerInfoH.innerText = `${playersNames[player]}, Twoja kolej!`
    document.querySelector("body #playerInfo").innerHTML = `<div a></div><div b></div><div c></div>`
    document.querySelector("div[a]").appendChild(playerInfoH)

    if (show) {
        document.querySelector("div[b]").innerHTML = ""
        for (const key in playersInfo[player].deck) {
            if (Object.hasOwnProperty.call(playersInfo[player].deck, key)) {
                const element = playersInfo[player].deck[key]
                document.querySelector("div[b]").appendChild(element.HTMLElement)
                element.HTMLElement.onclick = () => {
                    if (gameDefinition.code[0] && !gameDefinition.code[1]) cardAction(element, key)
                    else canPlace(element, key)
                }
            }
        }
        var addCard = document.createElement("button")
        addCard.innerText = "Zakończ swoją turę"
        addCard.style.marginLeft = "20px"
        addCard.onclick = () => {
            gameDefinition.whichPlayerToPlay = (gameDefinition.whichPlayerToPlay + 1) % playersNames.length
            generateInfo(gameDefinition.whichPlayerToPlay)
        }
        document.querySelector("div[b]").appendChild(addCard)
    } else {
        var button = document.createElement("button")
        button.innerText = "Pokaż talię"
        button.onclick = () => {
            document.querySelector("div[b]").innerHTML = ""
            for (const key in playersInfo[player].deck) {
                if (Object.hasOwnProperty.call(playersInfo[player].deck, key)) {
                    const element = playersInfo[player].deck[key]
                    document.querySelector("div[b]").appendChild(element.HTMLElement)
                    element.HTMLElement.onclick = () => {
                        if (gameDefinition.code[0] && !gameDefinition.code[1]) cardAction(element, key)
                        else canPlace(element, key)
                    }
                }
            }
            if (gameDefinition.code[0] == gameDefinition.code[1]) {
                if (gameDefinition.deck.counts > 0) {
                    var addCard = document.createElement("button")
                    addCard.innerText = "Dobierz kartę"
                    addCard.style.marginLeft = "20px"
                    addCard.onclick = () => {
                        playersInfo[player].deck.push(gameDefinition.deck.pop())
                        if (gameDefinition.deck.counts == 0) {
                            gameDefinition.deck = new Deck(gameDefinition.placed.filter((x, i) => i > 0)).shuffle()
                            gameDefinition.placed = [gameDefinition.placed[0]]
                        }

                        generateInfo(gameDefinition.whichPlayerToPlay, true)
                    }
                    document.querySelector("div[b]").appendChild(addCard)
                } else {
                    var addCard = document.createElement("button")
                    addCard.innerHTML = "Zakończ swoją turę<br />(dobranie niemożliwe)"
                    addCard.style.marginLeft = "20px"
                    addCard.onclick = () => {
                        gameDefinition.whichPlayerToPlay = (gameDefinition.whichPlayerToPlay + 1) % playersNames.length
                        generateInfo(gameDefinition.whichPlayerToPlay)
                    }
                    document.querySelector("div[b]").appendChild(addCard)
                }
            }
        }
        document.querySelector("div[b]").appendChild(button)
        document.querySelector("div[c]").innerHTML = playersInfo[player].info.join("<br />")
        playersInfo[player].info = []
    }
}

/**
 *
 * @param {Card} card
 */
function cardAction(card, id) {
    const nextPlayer = (num) => (gameDefinition.whichPlayerToPlay + num) % playersNames.length
    const previousPlayer = (num) => (gameDefinition.whichPlayerToPlay - num < 0 ? playersNames.length - 1 : gameDefinition.whichPlayerToPlay - num)

    function WhichTurn() {
        var i = 0

        var lastBlock
        do {
            i++
            if (playersInfo[nextPlayer(i)].blocks > 0) lastBlock = playersInfo[nextPlayer(i)].blocks--
        } while (lastBlock > 0)

        return nextPlayer(i)
    }

    if (gameDefinition.code[0] && !gameDefinition.code[1]) {
        playersInfo[nextPlayer(1)].deck.push(card)
        playersInfo[gameDefinition.whichPlayerToPlay].deck = playersInfo[gameDefinition.whichPlayerToPlay].deck.filter((x, i) => i != id)

        if (--gameDefinition.code[2] <= 0) gameDefinition.code = [true, true, 0]
        gameDefinition.whichPlayerToPlay = nextPlayer(1)
        generateInfo(nextPlayer(1))
    } else {
        card.HTMLElement.onclick = () => {}

        gameDefinition.placed.unshift(card)

        playersInfo[gameDefinition.whichPlayerToPlay].deck = playersInfo[gameDefinition.whichPlayerToPlay].deck.filter((x, i) => i != id)

        document.querySelector("body #placedCards").innerHTML = ""
        for (let i = 0; i < gameDefinition.placed.length && i < 7; i++) {
            document.querySelector("body #placedCards").appendChild(gameDefinition.placed[i].HTMLElement)
        }

        if (card.value === "4" && gameDefinition.modifiers.includes(1)) {
            var newCard = gameDefinition.deck.pop()
            playersInfo[nextPlayer(1)].deck.push(newCard)
            newCard = newCard.isJoker ? `<span style="color: ${card.value.toLowerCase()}">Jokera</span>` : `karty ${card.value}${card.suit}`
            playersInfo[nextPlayer(1)].info.push(
                `Gracz ${
                    playersNames[gameDefinition.whichPlayerToPlay]
                } postawił czwórkę - zostałeś wymuszony z dobraniem <span class="emoji">${newCard}</span> (wg modyfikatora/zasady nr. 1)`
            )
            delete newCard
        }
        if (card.value === "9" && gameDefinition.modifiers.includes(2)) {
            if (card.suit === SUITS[3] && gameDefinition.modifiers.includes(3)) {
                var newCard = gameDefinition.deck.pop()
                playersInfo[previousPlayer(1)].deck.push(newCard)
                playersInfo[previousPlayer(1)].blocks++
                newCard = newCard.isJoker ? `<span style="color: ${card.value.toLowerCase()}">Jokera</span>` : `karty ${card.value}${card.suit}`
                playersInfo[previousPlayer(1)].info.push(
                    `Gracz ${
                        playersNames[gameDefinition.whichPlayerToPlay]
                    } postawił dziewiątkę wino (♠️) - zostałeś wymuszony z dobraniem <span class="emoji">${newCard}</span> i czekania kolejkę (wg modyfikatora/zasady nr. 3)`
                )
            } else {
                var newCard = gameDefinition.deck.pop()
                playersInfo[nextPlayer(1)].deck.push(newCard)
                playersInfo[nextPlayer(1)].blocks++
                newCard = newCard.isJoker ? `<span style="color: ${card.value.toLowerCase()}">Jokera</span>` : `karty ${card.value}${card.suit}`
                playersInfo[nextPlayer(1)].info.push(
                    `Gracz ${
                        playersNames[gameDefinition.whichPlayerToPlay]
                    } postawił dziewiątkę - zostałeś wymuszony z dobraniem <span class="emoji">${newCard}</span> i czekania kolejkę (wg modyfikatora/zasady nr. 2)`
                )
            }
        }

        if (playersInfo[gameDefinition.whichPlayerToPlay].deck.length == 0) {
            document.querySelector("body #playerInfo").innerHTML = `<h1>${playersNames[gameDefinition.whichPlayerToPlay]} wygrał!</h1>`
        } else {
            gameDefinition.whichPlayerToPlay = WhichTurn()
            generateInfo(gameDefinition.whichPlayerToPlay)
        }
    }
}

function canPlace(element, key) {
    //console.log(element, gameDefinition.placed[0])
    if (gameDefinition.placed[0].isJoker) {
        if (
            gameDefinition.placed[0].suit === "Blue" ||
            (gameDefinition.placed[0].suit === "Black" && (element.suit === SUITS[1] || element.suit === SUITS[3])) ||
            (gameDefinition.placed[0].suit === "Red" && (element.suit === SUITS[0] || element.suit === SUITS[2]))
        ) {
            cardAction(element, key)
        }
    } else {
        if (gameDefinition.placed[0].value === element.value) {
            cardAction(element, key)
        } else if (element.isJoker) {
            if (
                element.suit === "Blue" ||
                (element.suit === "Black" && (gameDefinition.placed[0].suit === SUITS[1] || gameDefinition.placed[0].suit === SUITS[3])) ||
                (element.suit === "Red" && (gameDefinition.placed[0].suit === SUITS[0] || gameDefinition.placed[0].suit === SUITS[2]))
            ) {
                cardAction(element, key)
            }
        } else if (gameDefinition.placed[0].suit === element.suit) {
            cardAction(element, key)
        }
    }
}

window.onload = () => {
    var textArea = document.createElement("textarea")
    textArea.id = "playerList"
    var divInfo = document.createElement("div")
    divInfo.id = "info"
    var spans = [document.createElement("span"), document.createElement("span")]
    spans[0].innerText = "Ilość osób: "
    spans[1].classList.add("len")
    divInfo.appendChild(spans[0])
    divInfo.appendChild(spans[1])
    var btn = document.createElement("button")
    btn.innerText = "Start"
    btn.onclick = () => {
        if (
            document
                .querySelector("#playerList")
                .value.split("\n")
                .filter((x) => x.length > 0).length > 1
        ) {
            playersNames = document
                .querySelector("#playerList")
                .value.split("\n")
                .filter((x) => x.length > 0)
            startNewMatch()
        }
    }
    document.body.appendChild(divInfo)
    document.body.appendChild(textArea)
    document.body.appendChild(document.createElement("br"))
    document.body.appendChild(btn)

    ticker()
}

function ticker() {
    if (loc == "conf") {
        document.querySelector("#info .len").innerHTML = document
            .querySelector("#playerList")
            .value.split("\n")
            .filter((x) => x.length > 0).length
    }
    requestAnimationFrame(ticker)
}
