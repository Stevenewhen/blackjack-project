/*----- constants -----*/


/*----- app's state (variables) -----*/
//*cards will be an array [a, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, K, Q, K]
// set up a variable to let the rules of J,K,Q,K = 10
//depending on image srcs and how their naming structure is, we can use 
//a ${} to help use navigate through
//the cards seem easier, this will be an alt for the array method.
//similar to RPS LookUp*

//***----key:  p= player d=dealer
//pSum
//Dsum

let pSum = 0;
let dSum = 0;

var pAceCount = 0;
var dAceCount = 0;

var canHit = true;

var hidden;
var deck;


//the ACE is a unique card because it could = 1 or 11 (if)
//pAceCount
//dAceCount
// this can determine if it's a true or false statement to help us with our functions.


/*----- cached element references -----*/
//document.getElementById('dWins).innerHTML = winsDealer
//player and dealer results
// document.getElementById('dSum').innerText = dSum;
// document.getElementById('pSum').innerText = pSum;

/*----- event listeners -----*/


/*----- functions -----*/

window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
    let types = ['clubs', 'diamonds', 'hearts', 'spades'];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "_of_" + types[i]); //ace-clubs -> king-clubs, ace-diamond...
        }
    }
    // console.log(deck)
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck)
}

function startGame() {
    // Dealer's hidden card
    hidden = deck.pop();
    let hiddenCardImg = document.createElement("img");
    hiddenCardImg.src = "./assets/cards/hidden.png";
    document.getElementById("dCards").append(hiddenCardImg);
    // Dealer's visible card
    let visibleCardImg = document.createElement("img");
    let visibleCard = deck.pop();
    visibleCardImg.src = "./assets/cards/" + visibleCard + ".png";
    dSum += getValue(visibleCard);
    dAceCount += checkAce(visibleCard);
    document.getElementById("dCards").append(visibleCardImg);
    // Player gets two cards
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./assets/cards/" + card + ".png";
        pSum += getValue(card);
        pAceCount += checkAce(card);
        document.getElementById("pCards").append(cardImg);
    }
    updateAllSum();

    document.getElementById('hit').addEventListener('click', hit);
    document.getElementById('stay').addEventListener('click', stay);
}



function stay() {
    let hiddenCard = document.getElementById("dCards").lastChild;
    hiddenCard.src = "./assets/cards/" + hidden + ".png";
    dSum = reduceAce(dSum, dAceCount);
    pSum = reduceAce(pSum, pAceCount);

    canHit = false;
    document.getElementById('hidden').src = './assets/cards/' + hidden + '.png';

    while (dSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./assets/cards/" + card + ".png";
        dSum += getValue(card);
        dAceCount += checkAce(card);
        document.getElementById("dCards").append(cardImg);
    }
    
    updateAllSum();

    let message = "";
    if (pSum > 21) {
        message = 'You Lose!';
    }
    else if (dSum > 21) {
        message = 'You Win!';
    }
    else if (pSum === dSum) {
        message = 'Tie!';
    }
    else if (pSum > dSum) {
        message = "You Win!";
    }
    else if (pSum < dSum) {
        message = "You Lose!";
    }
    document.getElementById('results').innerText = message;
}

function hit() {
    if (!canHit) {
        return
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./assets/cards/" + card + ".png";
    pSum += getValue(card);
    pAceCount += checkAce(card);
    document.getElementById("pCards").append(cardImg);

    if (reduceAce(pSum, pAceCount) > 21) {
        canHit = false;
    }
    updateAllSum();

    let message = "";
    if (pSum > 21) {
        message = 'You Lose!';
        document.getElementById('results').innerText = message;
    }
}

function getValue(card) {
    let data = card.split("_of_");
    let value = data[0];

    if (isNaN(value)) {
        if (value == 'ace') {
            return 11;
        }
        return 10; 
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == 'ace') {
        return 1;
    }
    return 0;
}

function reduceAce(pSum, pAceCount) {
    while (pSum > 21 && pAceCount > 0) {
        pSum -= 10;
        pAceCount -= -1;
    }
    return pSum;
}

function updateAllSum() {
    document.getElementById('pSum').innerText = pSum;
    document.getElementById('dSum').innerText = dSum;
}

