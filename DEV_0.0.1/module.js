const SUITS = ["♥️", "♣️", "♦️", "♠️"]
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
const JOCKERS = ["Red", "Black", "Blue"]

const PlayerDeck = [4, 4, 5, 6, 7, 6]

var loc = "conf"

class Card {
    constructor(val, suit) {
        this.isJoker = val === "Joker"

        var cardHTML = document.createElement("button")
        cardHTML.className = "card"
        var cardSuitHTML = document.createElement("div")
        cardSuitHTML.className = "suit"
        if (val !== "Jocker") {
            cardSuitHTML.innerText = suit
        } else {
            cardSuitHTML.innerText = "🃟"
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
    constructor(cards = freshDeck()) {
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

    //console.log(v.map((card) => `${card.value} / ${card.suit}`))
    return v
}

// ----------------------------------------------------------------

/**
 * @type {{ deck: Card[], info: string[], blocks: number }[]}
 */
var playersInfo = []
var playersNames = ["A", "B"]

var gameDefinition = {
    deck: new Deck(),
    /**
     * @type {Card[]}
     */
    placed: [],
    playerDeckType: -1,
    whichPlayerToPlay: -1,
    modifiers: [],
    code: "00-0",
}

function start() {
    loc = "game"

    gameDefinition.deck = new Deck().shuffle()
    gameDefinition.playerDeckType = Math.floor(Math.random() * 6)
    gameDefinition.whichPlayerToPlay = Math.floor(Math.random() * playersNames.length)
    if (gameDefinition.playerDeckType == 6) gameDefinition.code = `10-${gameDefinition.whichPlayerToPlay}`

    for (let i = 0; i < playersNames.length; i++) {
        playersInfo[i] = { deck: [], info: [], blocks: 0, innumiteSayed: false }
    }

    document.body.innerHTML = `<div id="playerInfo"></div><div id="placedCards"></div>`

    for (let j = 0; j < PlayerDeck[gameDefinition.playerDeckType]; j++) {
        for (let i = 0; i < playersNames.length; i++) {
            playersInfo[i].deck.push(gameDefinition.deck.pop())
        }
    }

    const firstcard = gameDefinition.deck.pop()
    console.log(firstcard)
    gameDefinition.placed.push(firstcard)
    document.querySelector("body #placedCards").appendChild(firstcard.HTMLElement)

    generateInfo(gameDefinition.whichPlayerToPlay)
}

/**
 *
 * @param {number} player
 */
function generateInfo(player) {
    var playerInfoH = document.createElement("h1")
    playerInfoH.innerText = `${playersNames[player]}, Twoja kolej!`
    document.querySelector("body #playerInfo").innerHTML = `<div a></div><div b></div>`
    document.querySelector("div[a]").appendChild(playerInfoH)

    var button = document.createElement("button")
    button.innerText = "Pokaż talię"
    button.onclick = () => {
        document.querySelector("div[b]").innerHTML = ""
        for (const key in playersInfo[player].deck) {
            if (Object.hasOwnProperty.call(playersInfo[player].deck, key)) {
                const element = playersInfo[player].deck[key]
                document.querySelector("div[b]").appendChild(element.HTMLElement)
                element.HTMLElement.onclick = () => {
                    if (gameDefinition.placed[0].isJoker) {
                        if (
                            gameDefinition.placed[0].suit === "Blue" ||
                            (gameDefinition.placed[0].suit === "Black" && (element.suit === SUITS[1] || element.suit === SUITS[3])) ||
                            (gameDefinition.placed[0].suit === "Red" && (element.suit === SUITS[0] || element.suit === SUITS[2]))
                        ) {
                            placeCard(element, key)
                        }
                    } else {
                        if (gameDefinition.placed[0].suit === element.suit || gameDefinition.placed[0].value === element.value) {
                            placeCard(element, key)
                        }
                    }
                }
            }
        }
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

                gameDefinition.whichPlayerToPlay = (gameDefinition.whichPlayerToPlay + 1) % playersNames.length
                generateInfo(gameDefinition.whichPlayerToPlay)
            }
            document.querySelector("div[b]").appendChild(addCard)
        }
    }
    document.querySelector("div[b]").appendChild(button)
}

/**
 *
 * @param {Card} card
 */
function placeCard(card, id) {
    card.HTMLElement.onclick = () => {}

    gameDefinition.placed.unshift(card)

    playersInfo[gameDefinition.whichPlayerToPlay].deck = playersInfo[gameDefinition.whichPlayerToPlay].deck.filter((x, i) => i != id)

    document.querySelector("body #placedCards").innerHTML = ""
    for (let i = 0; i < gameDefinition.placed.length && i < 15; i++) {
        document.querySelector("body #placedCards").appendChild(gameDefinition.placed[i].HTMLElement)
    }

    if (playersInfo[gameDefinition.whichPlayerToPlay].deck.length == 0) {
        document.querySelector("div[b]").innerHTML = `<h1>${playersNames[gameDefinition.whichPlayerToPlay]} wygrał!</h1>`
    } else {
        gameDefinition.whichPlayerToPlay = (gameDefinition.whichPlayerToPlay + 1) % playersNames.length
        generateInfo(gameDefinition.whichPlayerToPlay)
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
            start()
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
