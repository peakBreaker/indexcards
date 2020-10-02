
const SOURCES = [
  {"url": "https://pages.peakbreaker.com/indexcards/dp-100.json", "title": "Microsoft DP100 Exam"},
]


// Get the buttons and text
var selectCourse = document.getElementById("selectCourseDropdown");
var selectCourseSubmit = document.getElementById("selectCourseSubmit");
var remainingCards = document.getElementById("remainingCards");
var cardText = document.getElementById("cardText");
var answerText = document.getElementById("answerText");
var nextCardButton = document.getElementById("next_card");
var switchSideButton = document.getElementById("switch_side");

// Variables
var cardsData = "";
var card = "";

// Functions
function getNextCard () {
  // Clear answer and update length of cards
  switchSideButton.hidden = false;
  answerText.innerHTML = "";
  remainingCards.innerHTML = "Remaining Cards: "+cardsData.length;
  if (cardsData.length === 0) {
    nextCardButton.hidden = true;
    switchSideButton.hidden = true;
    cardText.innerHTML = "You have finished the deck!"
    answerText.innerHTML = "Select a new deck to begin again";
  }

  // Get a random card
  let randomCardIndex = Math.floor(Math.random() * cardsData.length);
  console.log("button clicked! randomindex : " + randomCardIndex);
  card = cardsData[randomCardIndex]

  // TODO: Change this when we change the data
  cardText.innerHTML = card.question;

  // finally remove the card
  cardsData.splice(randomCardIndex, 1)
}

function switchSide () {
  switchSideButton.hidden = true;
  answerText.innerHTML = card.answer;
}

function getCards(url) {
  fetch(url)
      .then(response => response.json())
      .then(json => {cardsData = json})
      .then(reslt => {remainingCards.innerHTML = cardsData.length})
      .then(reslt => {getNextCard()})
  // unhide
  nextCardButton.hidden = false;
  switchSideButton.hiddel = false
}

SOURCES.forEach(element => {selectCourse.innerHTML+="<option>"+element.title+"</option>"})
console.log(selectCourse.value)

// Listeneres
nextCardButton.addEventListener("click", getNextCard);
switchSideButton.addEventListener("click", switchSide);
selectCourseSubmit.addEventListener("click", function(){ 
  getCards(SOURCES.find( ({ title }) => title === selectCourse.value).url) 
});

