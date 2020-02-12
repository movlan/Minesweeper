// constance
const boardSize = 10;
const mineCount = 10;

// variables
let board;
let mines;

// chased elements
const messageEl = document.querySelector('.message');
const boardEl = document.querySelector('.board');

// event listeners
boardEl.addEventListener('click', handleClick);

// functions
function init() {
    board = setBoard();
    mines = setMines();
    placeMines();
    addCellValues();
    render();
}

function handleClick(evt) {
    if (evt.target.getAttribute('class') !== 'cell') return;
    let x = parseInt(evt.target.getAttribute('x'));
    let y = parseInt(evt.target.getAttribute('y'));
    let boardValue = board[x][y];
    if (boardValue === 'M') {
        gameOver();
    } else if (boardValue > 0) {
        evt.target.classList.add('clicked');
        evt.target.innerText = boardValue;
    } else {
        isZero(x, y);
    }
}

function isZero(x,y) {
    // let element = document.querySelector(`[x="${x}"][y="${y}"]`);
    // element.classList.add('clicked');
    for (let i = x - 1; i < x + 2; i++) {
        if (i >= 0 && i < boardSize) {
            for (let j = y - 1; j < y + 2; j++) {
                if (j >= 0 && j < boardSize) {
                    if (!(i===x && j===y)) {
                        console.log(x, y, i, j)
                        // console.log(document.querySelector(`[x="${i}"][y="${j}"]`));
                    }
                }
            }
        }
    }

    // if (element.classList.contains('clicked')) {
    //     return;
    // } else {
        // for (let i = x - 1; i < x + 2; i++) {
        //     if (i >= 0 && i < boardSize && i !== x) {
        //         for (let j = y - 1; j < y + 2; j++) {
        //             if (j >= 0 && j < boardSize && j !== y) {
        //                 console.log(document.querySelector(`[x="${i}"][y="${j}"]`));
        //             }
        //         }
        //     }
        // }
    // }
    //     let test = document.querySelector(`[x="${x}"][y="${j}"]`);
    //     console.log(test);
    //                     console.log(test);
                        
    //                     if (board[i][j] === 0) {
    //                         // isZero(i, j);
    //                         // test.setAttribute('class', 'clicked');
    //                     } else {
    //                         // test.setAttribute('class', 'clicked');
    //                         // test.innerText = board[x][y];
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
} 

function gameOver() {
    alert('Game Over YOU LOSER!!!!');
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
            td.innerText = board[i][j];
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