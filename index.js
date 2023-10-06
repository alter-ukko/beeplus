const squares = [4,5,6,7,6,5,4];
let cur = 0;
let tiles = [];
let beeDivs = [];
let answerDiv = undefined;
let messageDiv = undefined;
let stageTextSpan = undefined;
let puzzleDateTextSpan = undefined;
let wordScoreSpan = undefined;
let totalScoreSpan = undefined;
let completeTotalTextSpan = undefined;
let completeDateTextSpan = undefined;
let shareMessageTextSpan = undefined;
let helpScreen = undefined;
let completeScreen = undefined;
let settingsScreen = undefined;
let themeCheckbox = undefined;
let puzzleDate = "";
let puzzle = {};
let wordList = [];
let theme = "light";
let beeEmoji = String.fromCodePoint(0x1f41d);
let answers = [
  {word: "", done: false},
  {word: "", done: false},
  {word: "", done: false},
  {word: "", done: false},
  {word: "", done: false},
  {word: "", done: false},
  {word: "", done: false},
];
const positions = [
  [
    {x: 0.85, y: 0.7, w: 1.1, h: 1.1},
    {x: 2.05, y: 0.7, w: 1.1, h: 1.1},
    {x: 0.85, y: 1.9, w: 1.1, h: 1.1},
    {x: 2.05, y: 1.9, w: 1.1, h: 1.1},
    {x: 10, y: 0, w: 0, h: 0},
    {x: 10, y: 0, w: 0, h: 0},
    {x: 10, y: 0, w: 0, h: 0},
  ],
  [
    {x: 0.85, y: 0.1, w: 1.1, h: 1.1},
    {x: 2.05, y: 0.1, w: 1.1, h: 1.1},
    {x: 0.85, y: 2.5, w: 1.1, h: 1.1},
    {x: 2.05, y: 2.5, w: 1.1, h: 1.1},
    {x: 1.45, y: 1.3, w: 1.1, h: 1.1},
    {x: 10, y: 0, w: 0, h: 0},
    {x: 10, y: 0, w: 0, h: 0},
  ],
  [
    {x: 0.85, y: 0.1, w: 1.1, h: 1.1},
    {x: 2.05, y: 0.1, w: 1.1, h: 1.1},
    {x: 0.85, y: 2.5, w: 1.1, h: 1.1},
    {x: 2.05, y: 2.5, w: 1.1, h: 1.1},
    {x: 0.85, y: 1.3, w: 1.1, h: 1.1},
    {x: 2.05, y: 1.3, w: 1.1, h: 1.1},
    {x: 10, y: 0, w: 0, h: 0},
  ],
  [
    {x: 0.85, y: 0.1, w: 1.1, h: 1.1},
    {x: 2.05, y: 0.1, w: 1.1, h: 1.1},
    {x: 0.85, y: 2.5, w: 1.1, h: 1.1},
    {x: 2.05, y: 2.5, w: 1.1, h: 1.1},
    {x: 0.25, y: 1.3, w: 1.1, h: 1.1},
    {x: 1.45, y: 1.3, w: 1.1, h: 1.1},
    {x: 2.65, y: 1.3, w: 1.1, h: 1.1},
  ],
]

const congrats = [
  "nice",
  "great jaerb",
  "noice",
  "weaow",
  "super",
  "monetized",
  "holey moley",
  "meow",
  "meow meow",
  "mee yow",
  "super",
  "well done",
  "pegged it",
  "double plus good",
  "hurrah",
  "incredible",
  "vocabulicious",
  "pangrammed",
]

function nextClicked() {
  if (cur >= 6) return;
  let stageMessage = setupLettersForMove(true);
  cur += 1;
  setPositions();
  setAnswerText();
  setScoreText();
  setStageText(stageMessage);
}

function prevClicked() {
  if (cur <= 0) return;
  let stageMessage = setupLettersForMove(false);
  cur -= 1;
  setPositions();  
  setAnswerText();
  setScoreText();
  setStageText(stageMessage);
}

function shuffleClicked() {
  let numSquares = squares[cur];
  let arr = [];
  let i;
  for (i=0; i<numSquares; i++) {
    arr.push(tiles[i].textContent);
  }
  shuffleArray(arr);
  for (i=0; i<numSquares; i++) {
    tiles[i].textContent = arr[i];
  }  
}

function shuffleArray(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function tileClicked(tile_idx) {
  if (answerDone()) return;
  if (answerWord().length >= 20) return;
  setAnswerWord(answers[cur].word + tiles[tile_idx].textContent);
  setAnswerText();
}

function deleteClicked() {
  if (answerWord().length === 0) return;
  setAnswerWord(answers[cur].word.substring(0, answers[cur].word.length-1));
  setAnswerDone(false);
  setAnswerText();
}

function enterClicked() {
  let answer = answerWord();
  if (answer.length < 4 || !usesAllLetters(answer)) {
    setAnswerWord("");
    setAnswerDone(false);
    setMessageText("all letters must be used");
    setAnswerText();
    setStageBees();
  } else if (wordList[answer] === 1) {
    setAnswerDone(true);
    setScoreText();
    setAnswerText();
    nextClicked();
    setMessageText(congrats[randomInt(congrats.length)]+"!");
    setStageBees();
  } else {
    setAnswerWord("");
    setAnswerDone(false);
    setMessageText("word not in list");
    setAnswerText();
    setStageBees();
  }
  if (puzzleDone()) finishClicked();
}

function usesAllLetters(answer) {
  // list of letters used for this stage
  let letters = puzzle.letters[cur];
  let chars = answer.split("");
  for (var i=0; i<letters.length; i++) {
    if (!chars.includes(letters[i])) return false;
  }
  return true;
}

function clearClicked() {
  setAnswerDone(false);
  setAnswerWord("");
  setAnswerText();
  setScoreText();
  setStageBees();
}

function finishClicked() {
  if (puzzleDone()) {
    let tot = getTotalScore();
    completeDateTextSpan.textContent = puzzleDate;
    completeTotalTextSpan.textContent = tot.totalScore + "/" + tot.bestTotalScore;
    completeScreen.style["display"] = "block";
  } else {
    setMessageText("not all stages complete");
  }
}

function completeCloseClicked() {
    completeScreen.style["display"] = "none";  
}

function shareClicked() {
  let tot = getTotalScore();
  let txt = beeEmoji + " bee+ " + puzzleDate + " | score: " + tot.totalScore + "/" + tot.bestTotalScore + " " + beeEmoji + "\n" + "https://beepl.us";
  let shareData = { text: txt };
  try {
    navigator.share(shareData);
  } catch (err) {
    navigator.clipboard.writeText(txt);
    setShareMessageText("copied to clipboard");    
  }
}

function helpClicked() {
  helpScreen.style["display"] = "block";
}

function helpCloseClicked() {
  helpScreen.style["display"] = "none";  
}

function settingsClicked() {
  settingsScreen.style["display"] = "block";
}

function settingsCloseClicked() {
  settingsScreen.style["display"] = "none";
}

function darkModeCheckboxChanged() {
  if (themeCheckbox.checked) {
    theme = "dark";
  } else {
    theme = "light";
  }
  saveTheme();
}

function saveTheme() {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function setupLettersForMove(movingRight) {
  var inc = -1;
  if (movingRight) inc = 1;
  let fromIdx = cur;
  let toIdx = cur + inc;
  let fromSquares = squares[fromIdx];
  let toSquares = squares[toIdx];
  let message;

  // the letter that will either be added or removed
  let letter = puzzle.changes[toIdx];
  if (movingRight) letter = puzzle.changes[fromIdx];

  let lettersIncreasing = (toSquares > fromSquares);
  if (lettersIncreasing) {
    message = "added "+letter;
    // adding a letter. make sure the one that's going
    // to pop into view contains the correct letter
    tiles[toSquares-1].textContent = letter;
  } else {
    message = "removed "+letter;
    // removing a letter. first find out where it is
    var letterIdx = 0;
    for (var i=0; i<fromSquares; i++) {
      if (tiles[i].textContent === letter) {
        letterIdx = i;
        break;
      }
    }
    // if it's not already in the tile that will be removed,
    // swap it with the letter that is
    if (letterIdx !== (fromSquares-1)) {
      tiles[letterIdx].textContent = tiles[fromSquares-1].textContent;
      tiles[fromSquares-1].textContent = letter;
    }
  }
  return message;
}

function setPositions() {
  //var txt = document.querySelector('.tile-count');
  //txt.textContent = ""+numSquares;
  let numSquares = squares[cur];
  let posIdx = numSquares - 4;
  let pos_array = positions[posIdx];
  for (var i=0; i<tiles.length; i++) {
    //tiles[i].style["background-color"] = "white";
    tiles[i].style["left"] = pos_array[i].x+"em";
    tiles[i].style["top"] = pos_array[i].y+"em";
    tiles[i].style["width"] = pos_array[i].w+"em";
    tiles[i].style["height"] = pos_array[i].h+"em";
  }
}

function setAnswerText() {
  answerDiv.textContent = answerWord();
  if (answerDone()) {
    answerDiv.style["color"] = "var(--ans-done-color)";
  } else {
    answerDiv.style["color"] = "var(--ans-color)";    
  }
}

function setScoreText() {
  let wordScore = 0;
  if (answerDone()) wordScore = answerWord().length;
  let bestWordScore = puzzle.best[cur];
  let tot = getTotalScore();
  wordScoreSpan.textContent = wordScore + "/" + bestWordScore;
  totalScoreSpan.textContent = tot.totalScore + "/" + tot.bestTotalScore;
}

function getTotalScore() {
  let totalScore = 0;
  let bestTotalScore = 0;
  for (var i=0; i<puzzle.best.length; i++) {
    bestTotalScore += puzzle.best[i];
    if (answerDone(i)) totalScore += answerWord(i).length;
  }
  return {totalScore: totalScore, bestTotalScore: bestTotalScore};
}

function setStageText(message) {
  puzzleDateTextSpan.textContent = puzzleDate;
  if (cur === 0) {
    stageTextSpan.textContent = ""+(cur+1)+"/7";
  } else {
    stageTextSpan.textContent = ""+(cur+1)+"/7 - "+message;    
  }
}

function setStageBees() {
  for (let i=0; i<answers.length; i++) {
    if (answerDone(i)) {
      beeDivs[i].style["opacity"] = "var(--finished-opacity)";
    } else {
      beeDivs[i].style["opacity"] = "var(--unfinished-opacity)";
    }
  }
}

function setLetters() {
  if (!("start" in puzzle)) return;
  puzzle.letters = [];
  let i;
  let j;
  for (i=0; i<7; i++) {
    puzzle.letters.push([]);
  }
  let idx = 0;
  for (i=0; i<puzzle.start.length; i++) {
    puzzle.letters[idx].push(puzzle.start[i]);
  }
  for (i=0; i<puzzle.add.length; i++) {
    idx++;
    for (j=0; j<puzzle.letters[idx-1].length; j++) {
      puzzle.letters[idx].push(puzzle.letters[idx-1][j]);
    }
    puzzle.letters[idx].push(puzzle.add[i]);
  }
  for (i=0; i<puzzle.remove.length; i++) {
    idx++;
    for (j=0; j<puzzle.letters[idx-1].length; j++) {
      if (puzzle.letters[idx-1][j] !== puzzle.remove[i]) {
        puzzle.letters[idx].push(puzzle.letters[idx-1][j]);
      }
    }
  }
}

function setChanges() {
  if (!("start" in puzzle)) return;
  puzzle.changes = [];
  let idx = 0;
  let i;
  for (i=0; i<puzzle.start.length; i++) {
    tiles[idx].textContent = puzzle.start[i];
    idx++;
  }
  for (i=0; i<puzzle.add.length; i++) {
    tiles[idx].textContent = puzzle.add[i];
    puzzle.changes.push(puzzle.add[i]);
    idx++;
  }
  for (i=0; i<puzzle.remove.length; i++) {
    puzzle.changes.push(puzzle.remove[i]);
  }
}

function setMessageText(msg) {
  messageDiv.textContent = msg;
  setTimeout(clearMessageText, 2000);
}

function clearMessageText() {
  messageDiv.textContent = "";  
}

function setShareMessageText(msg) {
  shareMessageTextSpan.textContent = msg;
  setTimeout(clearShareMessageText, 2000);
}

function clearShareMessageText() {
  shareMessageTextSpan.textContent = "";  
}

function loadUnfinishedFromStorage() {
  for (var i=0; i<7; i++) {
    var answer = localStorage.getItem("answer_"+i);
    var done = (localStorage.getItem("done_"+i) === "true");
    if (answer) {
      answers[i].word = answer;
      answers[i].done = done;
    }
  }
}

function answerWord(i) {
  let idx = cur;
  if (i !== undefined) idx = i;
  return answers[idx].word;
}

function answerDone(i) {
  let idx = cur;
  if (i !== undefined) idx = i;
  return answers[idx].done;
}

function puzzleDone() {
  var done = true;
  for (var i=0; i<answers.length; i++) {
    if (!answerDone(i) || answerWord(i).length === 0) {
      done = false;
      break;
    }
  }
  return done;
}

function setAnswerWord(w) {
  answers[cur].word = w;
  localStorage.setItem("answer_"+cur, w);
}

function setAnswerDone(d) {
  answers[cur].done = d;
  localStorage.setItem("done_"+cur, ""+d);
}

function clearStorage() {
  localStorage.clear();
  saveTheme();
}

function localDateFilename(dt) {
  let y = ""+dt.getFullYear();
  let m = ""+(dt.getMonth()+1);
  if (m.length < 2) m = "0"+m;
  let d = ""+dt.getDate();
  if (d.length < 2) d = "0"+d;
  return y+"_"+m+"_"+d;
}

function randomInt(max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * max);
}

async function loadWordList() {
  const response = await fetch("/beeplus/beeplus_words.json");
  wordList = await response.json();
}

async function loadPuzzle() {
  let curDate = localDateFilename(new Date());
  let unfinishedDate = localStorage.getItem("date");
  let loadedDate = localStorage.getItem("loaded_date");
  // the user refreshed an unfinished puzzle on a later date
  let dt = unfinishedDate ? unfinishedDate : curDate;
  if (unfinishedDate && loadedDate && (loadedDate > unfinishedDate)) {
    dt = curDate;
    clearStorage();
  }
  const response = await fetch("/beeplus/beeplus_"+dt+".json");
  puzzle = await response.json();
  puzzleDate = dt.replace(/_/g, "-");
  loadUnfinishedFromStorage();
  setChanges();
  setLetters();
  setScoreText();
  setAnswerText();
  setStageText();
  setStageBees();
  localStorage.setItem("date", dt);
  localStorage.setItem("loaded_date", curDate);
  if (puzzleDone()) finishClicked();
}

function keyDown(key) {
  switch (key) {
    case "PAGEDOWN":
    case "ARROWLEFT": {
      prevClicked();
      break;
    }
    case "PAGEUP":
    case "ARROWRIGHT": {
      nextClicked();
      break;
    }
    case "DELETE":
    case "BACKSPACE": {
      deleteClicked();
      break;
    }
    case "ENTER": {
      enterClicked();
      break;
    }
    case "ESCAPE": {
      clearClicked();
      break;
    }
    case "?": {
      helpClicked();
      break;
    }
    case "TAB": {
      shuffleClicked();
      break;
    }
    default: {
      if (key.length === 1 && puzzle.letters[cur].includes(key)) {
        for (let i=0; i<tiles.length; i++) {
          if (tiles[i].textContent === key) {
            tileClicked(i);
          }
        }
      }
    }
  }
}

document.body.addEventListener('keydown', function(event) {
  keyDown(event.key.toUpperCase());
});

theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "light";
saveTheme();
for (var i=0; i<7; i++) {
  let el = document.querySelector('.grid-tile-'+i);
  tiles.push(el);
  let beeEl = document.querySelector('.stage-bee-'+i);
  beeDivs.push(beeEl);
}
answerDiv = document.querySelector('.answer-text');
messageDiv = document.querySelector('.message-text');
stageTextSpan = document.querySelector('.stage-text');
puzzleDateTextSpan = document.querySelector('.puzzle-date');
wordScoreSpan = document.querySelector('.word-score');
totalScoreSpan = document.querySelector('.total-score');
completeTotalTextSpan = document.querySelector('.complete-total-text');
completeDateTextSpan = document.querySelector('.complete-date-text');
shareMessageTextSpan = document.querySelector('.share-message-text');
helpScreen = document.querySelector('#help');
settingsScreen = document.querySelector('#settings');
completeScreen = document.querySelector('#complete');
themeCheckbox = document.querySelector('#theme-checkbox');
themeCheckbox.checked = (theme === "dark");
loadWordList();
setPositions();
loadPuzzle();
