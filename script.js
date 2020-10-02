
// Get the buttons and text
var remainingCards = document.getElementById("remainingCards");
var cardText = document.getElementById("cardText");
var answerText = document.getElementById("answerText");
var nextCardButton = document.getElementById("next_card");
var switchSideButton = document.getElementById("switch_side");

// Get the data
var cardsData = "";
var card = "";


// Functions
function getNextCard () {
  // Clear answer and update length of cards
  switchSideButton.hidden = false;
  answerText.innerHTML = "";
  remainingCards.innerHTML = cardsData.length;

  // Get a random card
  let randomCardIndex = Math.floor(Math.random() * cardsData.length);
  console.log("button clicked! randomindex : " + randomCardIndex);
  card = cardsData[randomCardIndex]

  // TODO: Change this when we change the data
  cardText.innerHTML = card.title;

  // finally remove the card
  cardsData.splice(randomCardIndex, 1)
}

function switchSide () {
  switchSideButton.hidden = true;
  answerText.innerHTML = card.title;
}

fetch("https://jsonplaceholder.typicode.com/todos")
    .then(response => response.json())
    .then(json => {cardsData = json})
    .then(reslt => {remainingCards.innerHTML = cardsData.length})
    .then(reslt => {getNextCard()})

// Listeneres
nextCardButton.addEventListener("click", getNextCard);
switchSideButton.addEventListener("click", switchSide);
