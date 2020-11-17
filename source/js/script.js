// constance
const boardSize = 10;
const mineCount = 10;
const colors = {
  1: "mediumblue",
  2: "green",
  3: "red",
  4: "navy",
  5: "brown",
  6: "olive",
  7: "black",
  8: "grey",
};

// variables
let board;
let mines;
let clickAllowed;
let flags;
let flagMode;
let timer;
let countdown;
let flagsArr;

// chased elements
const messageEl = document.querySelector(".message");
const boardEl = document.querySelector(".board");
const btnEl = document.querySelector(".reset");
const flagBtn = document.querySelector("#flag");
const timerCounter = document.querySelector(".counter");
const flagCounter = document.querySelector("p");

// event listeners
boardEl.addEventListener("click", handleClick);
btnEl.addEventListener("click", resetHandler);
flagBtn.addEventListener("click", enableFlagMode);

// functions

// Initializes the board for new game
function init() {
  board = setBoard();
  mines = setMines();
  clickAllowed = true;
  flagMode = false;
  flags = mineCount;
  timer = 0;
  rightGuessed = 0;
  timerCounter.innerHTML = `<p>${timer}</p>`;
  messageEl.innerText = "Welcome";
  placeMines();
  render();
  addCellValues();
}

// set board array of arrays
function setBoard() {
  let result = [];
  for (let i = 0; i < boardSize; i++) {
    result.push([]);
    for (let j = 0; j < boardSize; j++) {
      result[i].push(0);
    }
  }
  return result;
}

// set mines coordinates array
function setMines() {
  let result = [];
  while (result.length < mineCount) {
    let x = Math.floor(Math.random() * boardSize);
    let y = Math.floor(Math.random() * boardSize);
    if (!result.includes([x, y])) {
      result.push([x, y]);
    }
  }
  return result;
}

// place mines
function placeMines() {
  mines.forEach((el) => {
    board[el[0]][el[1]] = "M";
  });
}

// render the board to dom
function render() {
  let table = document.createElement("table");
  let tbody = document.createElement("tbody");
  board.forEach((arr, i) => {
    let row = document.createElement("tr");
    arr.forEach((el, j) => {
      let td = document.createElement("td");
      td.setAttribute("class", "cell");
      td.setAttribute("x", i);
      td.setAttribute("y", j);
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  boardEl.appendChild(table);
  if (flags >= 0) {
    flagCounter.innerText = flags;
  }
}

// adding cell values to each cell on the board
function addCellValues() {
  board.forEach((arr, i) => {
    arr.forEach((el, j) => {
      if (board[i][j] !== "M") {
        board[i][j] = cellValue(i, j);
        boardEl.querySelector(`[x="${i}"][y="${j}"`).style.color =
          colors[cellValue(i, j)];
      }
    });
  });
}

// calculate cell value helper
function cellValue(x, y) {
  let counter = 0;
  for (let i = x - 1; i < x + 2; i++) {
    if (i >= 0 && i < boardSize) {
      for (let j = y - 1; j < y + 2; j++) {
        if (j >= 0 && j < boardSize) {
          if (!(i === x && j === y)) {
            if (board[i][j] === "M") {
              counter++;
            }
          }
        }
      }
    }
  }
  return counter;
}

// reset button handler
function resetHandler() {
  boardEl.removeChild(document.querySelector("table"));
  init();
  clearInterval(countdown);
}

// enable flag mode to mark mines
function enableFlagMode(evt) {
  if (!flagMode) {
    flagMode = true;
    evt.target.style.backgroundColor = "red";
  } else {
    flagMode = false;
    evt.target.style.backgroundColor = "";
  }
}

// handle cell click
function handleClick(evt) {
  if (timer === 0) {
    countdown = setInterval(function () {
      timer++;
      timerCounter.innerHTML = `<p>${timer}</p>`;
      messageEl.innerText = "Good Luck";
    }, 1000);
  }
  if (evt.altKey || flagMode) {
    if (!evt.target.classList.contains("cell") || !clickAllowed) return;
    let x = parseInt(evt.target.getAttribute("x"));
    let y = parseInt(evt.target.getAttribute("y"));
    let boardValue = board[x][y];
    if (evt.target.classList.contains("flag")) {
      evt.target.removeAttribute("class", "flag");
      evt.target.setAttribute("class", "cell");
      flags++;
      if (boardValue === "M") {
        rightGuessed--;
      }
      if (flags >= 0) {
        flagCounter.innerText = flags;
      }
      return;
    } else if (evt.target.classList.contains("clicked")) {
      return;
    } else {
      evt.target.setAttribute("class", "cell flag");
      flags--;
      if (boardValue === "M") {
        rightGuessed++;
      }
      if (flags >= 0) {
        flagCounter.innerText = flags;
      }
    }
  }
  if (evt.target.getAttribute("class") !== "cell" || !clickAllowed) return;
  let x = parseInt(evt.target.getAttribute("x"));
  let y = parseInt(evt.target.getAttribute("y"));
  let boardValue = board[x][y];
  if (boardValue === "M") {
    // mine pressed game over
    gameOver();
    return;
  } else if (boardValue > 0) {
    // mark clicked and show value
    evt.target.classList.add("clicked");
    evt.target.innerText = boardValue;
  } else {
    // board value is zero calculate all surrounding cell values
    evt.target.classList.add("clicked");
    isZero(x, y);
  }
  // calculate if game won
  isWinner();
}

// calculate surrounding cells helper
function isZero(x, y) {
  for (let i = x - 1; i < x + 2; i++) {
    if (i >= 0 && i < boardSize) {
      for (let j = y - 1; j < y + 2; j++) {
        if (j >= 0 && j < boardSize) {
          if (!(i === x && j === y)) {
            if (
              document
                .querySelector(`[x="${i}"][y="${j}"]`)
                .classList.contains("flag")
            ) {
              break;
            }
            if (
              !document
                .querySelector(`[x="${i}"][y="${j}"]`)
                .classList.contains("clicked")
            ) {
              document
                .querySelector(`[x="${i}"][y="${j}"]`)
                .classList.add("clicked");
              if (board[i][j] > 0) {
                document.querySelector(`[x="${i}"][y="${j}"]`).innerText =
                  board[i][j];
              } else {
                isZero(i, j);
              }
            }
          }
        }
      }
    }
  }
}

// game over; show all mine location
function gameOver() {
  messageEl.innerText = "Game Over";
  clearInterval(countdown);
  mines.forEach((el) => {
    boardEl
      .querySelector(`[x="${el[0]}"][y="${el[1]}"`)
      .setAttribute("class", "mine");
  });
  clickAllowed = false;
}

// check winner helper
function isWinner() {
  let clickedCellCount = boardEl.getElementsByClassName("clicked").length;
  if (
    boardSize * boardSize - mineCount === clickedCellCount ||
    flags === 0 ||
    rightGuessed === mineCount
  ) {
    messageEl.innerText = "You Won!";
    clearInterval(countdown);
    clickAllowed = false;
  }
}

init();
