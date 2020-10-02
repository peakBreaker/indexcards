String.prototype.format = function () {
        var a = this;
        for (var k in arguments) {
            a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
        }
        return a
    }

const CollapseBase = `
  <div class="card">
    <div class="card-header" id="heading{0}">
      <h5 class="mb-0">
        <button class="btn btn-link" data-toggle="collapse" data-target="#collapse{0}" aria-expanded="true" aria-controls="collapse{0}">
          {1}
        </button>
      </h5>
    </div>

    <div id="collapse{0}" class="collapse" aria-labelledby="heading{0}" data-parent="#accordion">
      <div class="card-body">
        {2}
      </div>
    </div>
  </div>
`


const SOURCES = [
  {"url": "https://pages.peakbreaker.com/indexcards/dp-100.json", "title": "Microsoft DP100 Exam"},
  {"url": "https://pages.peakbreaker.com/indexcards/tensorflow_developer_cert.json", "title": "Tensorflow Developer Certificate"},
]


// Get the buttons and text
var mainGameElem = document.getElementById("cardGameMain");
var editGameElem = document.getElementById("cardGameEdit");

// Selecting stack
var selectCourse = document.getElementById("selectCourseDropdown");
var selectCourseSubmit = document.getElementById("selectCourseSubmit");

// For game
var remainingCards = document.getElementById("remainingCards");
var cardText = document.getElementById("cardText");
var answerText = document.getElementById("answerText");
var nextCardButton = document.getElementById("next_card");
var switchSideButton = document.getElementById("switch_side");

// For editing
var editStackToggleElem = document.getElementById("editStack");
var dlCardsElem = document.getElementById('downloadCards');
var accordionElem = document.getElementById("accordion");

// Variables
var cardsData = "";
var data = "";
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
  answerText.innerHTML = card.answer.replace("\n", "<br>");
}

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
function downloadCards() {
    console.log("downloading cards!" + data.length)
    downloadObjectAsJson(data, "cards");
}

function getCards(url) {
  let dataIdx=0
  fetch(url)
      .then(response => response.json())
      .then(json => {cardsData = json; data = json.slice()})
      .then(reslt => {remainingCards.innerHTML = cardsData.length})
      .then(reslt => {getNextCard()})
      .then(reslt => {data.forEach(elem => {accordionElem.innerHTML += CollapseBase.format(dataIdx++, elem.question, elem.answer)})})
  // unhide
  nextCardButton.hidden = false;
  switchSideButton.hiddel = false
}

function editModeToggle() {
    if (editGameElem.hidden) { getCards(SOURCES.find( ({ title }) => title === selectCourse.value).url) }
    mainGameElem.hidden=!mainGameElem.hidden;
    remainingCards.hidden=mainGameElem.hidden;
    editGameElem.hidden=!editGameElem.hidden;
}

SOURCES.forEach(element => {selectCourse.innerHTML+="<option>"+element.title+"</option>"})
console.log(selectCourse.value)

// Listeneres
nextCardButton.addEventListener("click", getNextCard);
switchSideButton.addEventListener("click", switchSide);
selectCourseSubmit.addEventListener("click", function(){ 
  getCards(SOURCES.find( ({ title }) => title === selectCourse.value).url) 
});

editStackToggleElem.addEventListener("click", editModeToggle);
dlCardsElem.addEventListener("click", downloadCards);
