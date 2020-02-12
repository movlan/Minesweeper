// constance
const boardSize = 10;
const mineCount = 5;

// variables
let board;
let mines;
let clickAllowed;

// chased elements
const messageEl = document.querySelector('.message');
const boardEl = document.querySelector('.board');

// event listeners
boardEl.addEventListener('click', handleClick);

// functions
function init() {
    board = setBoard();
    mines = setMines();
    clickAllowed = true
    placeMines();
    addCellValues();
    render();
}

function handleClick(evt) {
    if (evt.target.getAttribute('class') !== 'cell' || !clickAllowed) return;
    let x = parseInt(evt.target.getAttribute('x'));
    let y = parseInt(evt.target.getAttribute('y'));
    let boardValue = board[x][y];
    if (boardValue === 'M') {
        gameOver();
        return;
    } else if (boardValue > 0) {
        evt.target.classList.add('clicked');
        evt.target.innerText = boardValue;
    } else {
        evt.target.classList.add('clicked');
        isZero(x, y);
    }
    isWinner();
}

function isZero(x,y) {
    for (let i = x - 1; i < x + 2; i++) {
        if (i >= 0 && i < boardSize) {
            for (let j = y - 1; j < y + 2; j++) {
                if (j >= 0 && j < boardSize) {
                    if (!(i===x && j===y)) {
                        if (!(document.querySelector(`[x="${i}"][y="${j}"]`).classList.contains('clicked'))) {
                            document.querySelector(`[x="${i}"][y="${j}"]`).classList.add('clicked');
                            if (board[i][j] > 0) {
                                document.querySelector(`[x="${i}"][y="${j}"]`).innerText = board[i][j];
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

function isWinner() {
    let clickedCellCount = boardEl.getElementsByClassName('clicked').length
    if (boardSize * boardSize - mineCount === clickedCellCount) {
        messageEl.innerText = 'You Won! Atta BOY!!!';
        clickAllowed = false;
    }
}

function gameOver() {
    messageEl.innerText = 'Game Over YOU LOSER!!!!';
    clickAllowed = false;
}

function render() {
    renderBoard()
}

function addCellValues() {
    board.forEach((arr, i) => {
        arr.forEach((el, j) => {
            if (board[i][j] !== 'M') {
                board[i][j] = cellValue(i, j);
            }
        });
    });
}

function cellValue (x, y) {
    let counter = 0;
    for (let i = x - 1; i < x + 2; i++) {
        if (i >= 0 && i < boardSize) {
            for (let j = y - 1; j < y + 2; j++) {
                if (j >= 0 && j < boardSize) {
                    if (!(i===x && j===y)) {
                        if (board[i][j] === 'M') {
                            counter++;
                        }
                    }
                }
            }
        }
    }
    return counter; 
}

function placeMines() {
    mines.forEach(el => {
        board[el[0]][el[1]] = 'M'
    });
}

function renderBoard() {
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');
    board.forEach((arr, i) => {
        let row = document.createElement('tr');
        arr.forEach((el, j) => {
            let td = document.createElement('td');
            td.setAttribute('class', 'cell');
            td.setAttribute('x', i);
            td.setAttribute('y', j);
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    boardEl.appendChild(table);
}

function setBoard() {
    let result = [];
    for (let i = 0; i < boardSize; i++) {
        result.push([]);
        for (let j = 0; j < boardSize; j++) {
            result[i].push(0);
        }
    }
    return result
}

function setMines() {
    let result = [];
    while (result.length < mineCount) {
        let x = Math.floor(Math.random() * boardSize);
        let y = Math.floor(Math.random() * boardSize);
        if (!result.includes([x, y])) {
            result.push([x, y])
        }
    }
    return result;
}

init();