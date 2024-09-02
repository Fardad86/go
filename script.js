const size = 9;
const board = [];
let currentPlayer = 'black';

// ایجاد تخته و سلول‌ها
function createBoard() {
    const boardElement = document.getElementById('board');
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', placeStone);
            boardElement.appendChild(cell);
            board[i][j] = null;
        }
    }
}

// قرار دادن مهره
function placeStone(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (!board[row][col]) {
        const stone = document.createElement('div');
        stone.classList.add('stone', currentPlayer);
        event.target.appendChild(stone);
        board[row][col] = currentPlayer;

        if (checkCapture(parseInt(row), parseInt(col))) {
            captureStones(parseInt(row), parseInt(col));
        }

        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    }
}

// بررسی محاصره
function checkCapture(row, col) {
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    return (
        checkDirection(row - 1, col, opponent) ||
        checkDirection(row + 1, col, opponent) ||
        checkDirection(row, col - 1, opponent) ||
        checkDirection(row, col + 1, opponent)
    );
}

function checkDirection(row, col, opponent) {
    if (row < 0 || row >= size || col < 0 || col >= size) return false;
    return board[row][col] === opponent;
}

// گرفتن مهره‌های محاصره شده
function captureStones(row, col) {
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    if (checkDirection(row - 1, col, opponent)) removeStone(row - 1, col);
    if (checkDirection(row + 1, col, opponent)) removeStone(row + 1, col);
    if (checkDirection(row, col - 1, opponent)) removeStone(row, col - 1);
    if (checkDirection(row, col + 1, opponent)) removeStone(row, col + 1);
}

function removeStone(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.innerHTML = '';
    board[row][col] = null;
}

// شروع بازی
createBoard();
