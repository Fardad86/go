const size = 9; // اندازه تخته بازی
const board = []; // ذخیره وضعیت تخته
let currentPlayer = 'black'; // بازیکن جاری

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
            board[i][j] = null; // مقداردهی اولیه تخته
        }
    }
}

// قرار دادن مهره
function placeStone(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (!board[row][col]) { // بررسی اینکه خانه خالی باشد
        board[row][col] = currentPlayer;
        renderBoard();

        if (checkCapture(row, col)) {
            removeCapturedStones();
        }

        currentPlayer = currentPlayer === 'black' ? 'white' : 'black'; // تغییر نوبت
    }
}

// رسم تخته بازی
function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        cell.innerHTML = '';

        if (board[row][col]) {
            const stone = document.createElement('div');
            stone.classList.add('stone', board[row][col]);
            cell.appendChild(stone);
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

let capturedStones = [];

// شروع بازی
createBoard();
