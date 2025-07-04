let cells = document.querySelectorAll('.cell');
let result = document.getElementById('result');
let chooseX = document.getElementById('chooseX');
let chooseO = document.getElementById('chooseO');
const restartbtn = document.getElementById('restartBtn');
const winconditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let player1Symbol = '';
let player2Symbol = '';
let currentPlayer = '';
let gameActive = false;


chooseX.addEventListener("click", () => {
    player1Symbol = "X";
    player2Symbol = "O";
    currentPlayer = player1Symbol;
    gameActive = true;
    result.textContent = `Player 1's turn (${currentPlayer})`;

    chooseX.disabled = true;
    chooseO.disabled = true;
});

chooseO.addEventListener("click", () => {
    player1Symbol = "O";
    player2Symbol = "X";
    currentPlayer = player1Symbol;
    gameActive = true;
    result.textContent = `Player 1's turn (${currentPlayer})`;

    chooseX.disabled = true;
    chooseO.disabled = true;
});


cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (!gameActive) return;

        if (cell.textContent !== '') return;

        cell.textContent = currentPlayer;

        const cellValues = Array.from(cells).map(c => c.textContent);

        for (let condition of winconditions) {
            const [a, b, c] = condition;

            if (cellValues[a] === currentPlayer && cellValues[b] === currentPlayer && cellValues[c] === currentPlayer) {
                result.textContent = `player ${currentPlayer === player1Symbol ? 1 : 2} wins!`;
                gameActive = false;
                return;
            }
        }

        const allFilled = cellValues.every(val => val !== '');
        if (allFilled) {
            result.textContent = "It's a draw!";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === player1Symbol ? player2Symbol : player1Symbol;

        // if (currentPlayer === player1Symbol) {
        //     currentPlayer = player2Symbol;
        // } else {
        //     currentPlayer = player1Symbol;
        // }
        result.textContent = `Player ${currentPlayer === player1Symbol ? 1 : 2}'s turn (${currentPlayer})`;

    });
});

restartbtn.addEventListener("click", () => {

    cells.forEach(cell => {
        cell.textContent = '';
    });

    player1Symbol = '';
    player2Symbol = '';
    currentPlayer = '';
    gameActive = false;

    chooseX.disabled = false;
    chooseO.disabled = false;

    result.textContent = 'Game reset! Choose X or O to start again.';
});
