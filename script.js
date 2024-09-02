let size = 9; // Default board size
const board = []; // Store board state
let currentPlayer = 'black'; // Current player
let passCount = 0; // Number of consecutive passes
let gameEnded = false; // Game end status
let capturedStones = []; // Stones that are captured
let score = { black: 0, white: 0 }; // Player scores

// Create the board and initialize cells
function createBoard(newSize) {
    size = newSize;
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Clear previous board
    boardElement.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    boardElement.style.gridTemplateRows = `repeat(${size}, 50px)`;
    board.length = 0; // Clear previous board state

    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', placeStone);
            boardElement.appendChild(cell);
            board[i][j] = null; // Initialize board state
        }
    }
    drawGridLines(); // Draw grid lines on the board
}

// Draw grid lines on the board
function drawGridLines() {
    const boardElement = document.getElementById('board');
    for (let i = 1; i < size; i++) {
        const horizontalLine = document.createElement('div');
        horizontalLine.classList.add('grid-line', 'horizontal');
        horizontalLine.style.top = `${i * 50}px`;
        boardElement.appendChild(horizontalLine);

        const verticalLine = document.createElement('div');
        verticalLine.classList.add('grid-line', 'vertical');
        verticalLine.style.left = `${i * 50}px`;
        boardElement.appendChild(verticalLine);
    }
}

// Place a stone on the board
function placeStone(event) {
    if (gameEnded) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (!board[row][col]) { // Ensure the cell is empty
        board[row][col] = currentPlayer;
        renderBoard();

        if (checkCapture(row, col)) {
            removeCapturedStones();
        }

        // Reset pass count after a move
        passCount = 0;

        // Switch turn
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    }
}

// Render the board
function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        cell.innerHTML = '';

        if (board[row][col]) {
            const stone = document.createElement('div');
            stone.classList.add('stone', board[row][col]);
            stone.style.opacity = 0;
            cell.appendChild(stone);
            // Animate stones
            setTimeout(() => {
                stone.style.opacity = 1;
                stone.style.transform = 'translate(-50%, -50%) scale(1.2)';
                setTimeout(() => stone.style.transform = 'translate(-50%, -50%) scale(1)', 300);
            }, 0);
        }
    });
}

// Check for captured stones
function checkCapture(row, col) {
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    const capturedGroups = [];

    [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]].forEach(([r, c]) => {
        if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === opponent) {
            const group = getGroup(r, c);
            if (group.liberties === 0) {
                capturedGroups.push(group.stones);
            }
        }
    });

    if (capturedGroups.length > 0) {
        capturedStones = capturedGroups.flat();
        return true;
    }

    return false;
}

// Find connected stones and count liberties
function getGroup(row, col) {
    const color = board[row][col];
    const visited = [];
    const stones = [];
    let liberties = 0;

    function explore(r, c) {
        if (r < 0 || r >= size || c < 0 || c >= size) return;
        if (visited.includes(`${r},${c}`)) return;

        visited.push(`${r},${c}`);

        if (board[r][c] === color) {
            stones.push([r, c]);
            [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([nr, nc]) => explore(nr, nc));
        } else if (!board[r][c]) {
            liberties++;
        }
    }

    explore(row, col);
    return { stones, liberties };
}

// Remove captured stones
function removeCapturedStones() {
    capturedStones.forEach(([r, c]) => {
        board[r][c] = null;
    });
    capturedStones = [];
    renderBoard();
}

// End the game and determine the winner
function endGame() {
    gameEnded = true;
    score = calculateScore();
    const winner = score.black > score.white ? 'Black' : score.white > score.black ? 'White' : 'Draw';
    document.getElementById('status').innerText = `Game Over. Winner: ${winner}. Score - Black: ${score.black}, White: ${score.white}`;
}

// Calculate the score
function calculateScore() {
    const score = { black: 0, white: 0 };

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c]) {
                const color = board[r][c];
                if (color === 'black') {
                    score.black++;
                } else {
                    score.white++;
                }
            }
        }
    }

    // Add additional logic for area scoring if needed

    return score;
}

// Handle "Pass" button
document.getElementById('passButton').addEventListener('click', () => {
    if (gameEnded) return;

    passCount++;
    if (passCount === 2) {
        endGame();
    } else {
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black'; // Switch turn
    }
});

// Handle board size selection
document.getElementById('boardSize').addEventListener('change', (event) => {
    const newSize = parseInt(event.target.value);
    createBoard(newSize);
    gameEnded = false; // Reset game end status
    passCount = 0; // Reset pass count
    score = { black: 0, white: 0 }; // Reset score
    document.getElementById('status').innerText = ''; // Clear status message
});

// Start the game
createBoard(size);


// let size = 9; // اندازه پیش‌فرض تخته
// const board = []; // ذخیره وضعیت تخته
// let currentPlayer = 'black'; // بازیکن جاری

// // ایجاد تخته و سلول‌ها
// function createBoard(newSize) {
//     size = newSize;
//     const boardElement = document.getElementById('board');
//     boardElement.innerHTML = ''; // پاک کردن تخته قبلی
//     boardElement.style.gridTemplateColumns = `repeat(${size}, 50px)`;
//     boardElement.style.gridTemplateRows = `repeat(${size}, 50px)`;
//     board.length = 0; // پاک کردن وضعیت قبلی تخته

//     for (let i = 0; i < size; i++) {
//         board[i] = [];
//         for (let j = 0; j < size; j++) {
//             const cell = document.createElement('div');
//             cell.classList.add('cell');
//             cell.dataset.row = i;
//             cell.dataset.col = j;
//             cell.addEventListener('click', placeStone);
//             boardElement.appendChild(cell);
//             board[i][j] = null; // مقداردهی اولیه تخته
//         }
//     }
// }

// // قرار دادن مهره
// function placeStone(event) {
//     const row = parseInt(event.target.dataset.row);
//     const col = parseInt(event.target.dataset.col);

//     if (!board[row][col]) { // بررسی اینکه خانه خالی باشد
//         board[row][col] = currentPlayer;
//         renderBoard();

//         if (checkCapture(row, col)) {
//             removeCapturedStones();
//         }

//         currentPlayer = currentPlayer === 'black' ? 'white' : 'black'; // تغییر نوبت
//     }
// }

// // رسم تخته بازی
// function renderBoard() {
//     const cells = document.querySelectorAll('.cell');
//     cells.forEach(cell => {
//         const row = parseInt(cell.dataset.row);
//         const col = parseInt(cell.dataset.col);
//         cell.innerHTML = '';

//         if (board[row][col]) {
//             const stone = document.createElement('div');
//             stone.classList.add('stone', board[row][col]);
//             stone.style.opacity = 0;
//             cell.appendChild(stone);
//             // انیمیشن مهره‌ها
//             setTimeout(() => {
//                 stone.style.opacity = 1;
//                 stone.style.transform = 'translate(-50%, -50%) scale(1.2)';
//                 setTimeout(() => stone.style.transform = 'translate(-50%, -50%) scale(1)', 300);
//             }, 0);
//         }
//     });
// }

// // بررسی محاصره مهره‌ها
// function checkCapture(row, col) {
//     const opponent = currentPlayer === 'black' ? 'white' : 'black';
//     const capturedGroups = [];

//     [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]].forEach(([r, c]) => {
//         if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === opponent) {
//             const group = getGroup(r, c);
//             if (group.liberties === 0) {
//                 capturedGroups.push(group.stones);
//             }
//         }
//     });

//     if (capturedGroups.length > 0) {
//         capturedStones = capturedGroups.flat();
//         return true;
//     }

//     return false;
// }

// // یافتن گروه مهره‌های متصل و شمارش خطوط آزادی
// function getGroup(row, col) {
//     const color = board[row][col];
//     const visited = [];
//     const stones = [];
//     let liberties = 0;

//     function explore(r, c) {
//         if (r < 0 || r >= size || c < 0 || c >= size) return;
//         if (visited.includes(`${r},${c}`)) return;

//         visited.push(`${r},${c}`);

//         if (board[r][c] === color) {
//             stones.push([r, c]);
//             [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([nr, nc]) => explore(nr, nc));
//         } else if (!board[r][c]) {
//             liberties++;
//         }
//     }

//     explore(row, col);
//     return { stones, liberties };
// }

// // حذف مهره‌های محاصره‌شده
// function removeCapturedStones() {
//     capturedStones.forEach(([r, c]) => {
//         board[r][c] = null;
//     });
//     capturedStones = [];
//     renderBoard();
// }

// let capturedStones = [];

// // تنظیم اندازه تخته
// document.getElementById('boardSize').addEventListener('change', (event) => {
//     const newSize = parseInt(event.target.value);
//     createBoard(newSize);
// });

// // شروع بازی
// createBoard(size);

