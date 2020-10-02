String.prototype.format = function () {
        var a = this;
        for (var k in arguments) {
            a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
        }
        return a
    }

const CollapseBase = `
  <div class="card" id="card{0}">
    <div class="card-header" id="heading{0}">
      <h5 class="mb-0">
        <button id="collapseButton{0}" class="btn btn-link" data-toggle="collapse" data-target="#collapse{0}" aria-expanded="true" aria-controls="collapse{0}" onclick="document.getElementById('collapseButton{0}').innerHTML=document.getElementById('questionInput{0}').value;">
          {1}
        </button>
      </h5>
    </div>

    <div id="collapse{0}" class="collapse" aria-labelledby="heading{0}" data-parent="#accordion">
      <div class="card-body">
        <input id="questionInput{0}" class="form-control question" type="text" value="{1}">
        <hr>
        <textarea class="form-control answer" id="exampleFormControlTextarea{0}" rows="6">{2}</textarea>
        <hr>
        <button id="selectCourseSubmit" class="btn-lg btn-block btn btn-danger" onclick="{elem=document.getElementById('card{0}');elem.parentNode.removeChild(elem)}">Delete</button>
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
var dataIdx=0

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
    // Finally download the json object
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
    // Retreive the data from the edited objects
    let elems = document.getElementsByClassName("card");
    console.log(elems)
    newData = [];
    var i;
    for (i = 0; i < elems.length; i++) {
        let q = elems[i].getElementsByClassName("question")[0].value;
        let a = elems[i].getElementsByClassName("answer")[0].innerHTML;
        //let s = elems[i].getElementsByClassName("subject")[0].innerHTML;
        let s = "";
        console.log(q)
        newData.push({"question": q, "answer": a, "subject": s});
    };
    console.log(newData);
    downloadObjectAsJson(newData, "cards");
}

function getCards(url) {
  dataIdx = 0;
  accordionElem.innerHTML = "";
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

function editModeToggle(newStack) {
    if (editGameElem.hidden && !newStack) { getCards(SOURCES.find( ({ title }) => title === selectCourse.value).url) }
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

editStackToggleElem.addEventListener("click", function() {editModeToggle(false)});
document.getElementById("newStack").addEventListener("click", function() {editModeToggle(true)});
dlCardsElem.addEventListener("click", downloadCards);
document.getElementById("addCard").addEventListener("click", function () {accordionElem.innerHTML += CollapseBase.format(dataIdx++, "Empty card", "")});

