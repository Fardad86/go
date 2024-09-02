let size = 9; // اندازه پیش‌فرض تخته
const board = []; // ذخیره وضعیت تخته
let currentPlayer = 'black'; // بازیکن جاری
let passCount = 0; // شمارش دفعات پاس
let gameEnded = false; // وضعیت اتمام بازی
let score = { black: 0, white: 0 }; // امتیاز هر بازیکن

// ایجاد تخته و سلول‌ها
function createBoard(newSize) {
    size = newSize;
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // پاک کردن تخته قبلی
    boardElement.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    boardElement.style.gridTemplateRows = `repeat(${size}, 50px)`;
    board.length = 0; // پاک کردن وضعیت قبلی تخته

    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', placeStone);
            boardElement.appendChild(cell);
            board[i][j] = null; // مقداردهی اولیه تخته
        }
    }
    drawGridLines(); // اضافه کردن خط کشی به تخته
}

// رسم خط کشی
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

// قرار دادن مهره
function placeStone(event) {
    if (gameEnded) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (!board[row][col]) { // بررسی اینکه خانه خالی باشد
        board[row][col] = currentPlayer;
        renderBoard();

        if (checkCapture(row, col)) {
            removeCapturedStones();
        }

        // تغییر نوبت
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';

        // بررسی وضعیت پاس
        passCount = (passCount + 1) % 2;
        if (passCount === 0) {
            endGame();
        }
    }
}

// نمایش تخته بازی
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
            // انیمیشن مهره‌ها
            setTimeout(() => {
                stone.style.opacity = 1;
                stone.style.transform = 'translate(-50%, -50%) scale(1.2)';
                setTimeout(() => stone.style.transform = 'translate(-50%, -50%) scale(1)', 300);
            }, 0);
        }
    });
}

// بررسی محاصره مهره‌ها
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

// یافتن گروه مهره‌های متصل و شمارش خطوط آزادی
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

// حذف مهره‌های محاصره‌شده
function removeCapturedStones() {
    capturedStones.forEach(([r, c]) => {
        board[r][c] = null;
    });
    capturedStones = [];
    renderBoard();
}

// پایان بازی و تعیین برنده
function endGame() {
    gameEnded = true;
    score = calculateScore();
    const winner = score.black > score.white ? 'سیاه' : score.white > score.black ? 'سفید' : 'تساوی';
    document.getElementById('status').innerText = `بازی پایان یافت. برنده: ${winner}. امتیاز - سیاه: ${score.black}, سفید: ${score.white}`;
}

// محاسبه امتیاز
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
    
    // اضافه کردن امتیاز برای مناطق خالی و به‌دست آمده توسط هر بازیکن
    return score;
}

// گزینه "پاس"
document.getElementById('passButton').addEventListener('click', () => {
    if (gameEnded) return;

    passCount = (passCount + 1) % 2;
    if (passCount === 0) {
        endGame();
    } else {
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black'; // تغییر نوبت
    }
});

// تنظیم اندازه تخته
document.getElementById('boardSize').addEventListener('change', (event) => {
    const newSize = parseInt(event.target.value);
    createBoard(newSize);
    gameEnded = false; // بازنشانی وضعیت اتمام بازی
    score = { black: 0, white: 0 }; // بازنشانی امتیاز
    document.getElementById('status').innerText = ''; // پاک کردن وضعیت
});

// شروع بازی
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

