const Player = (sign) => {
    this.sign = sign;

    const getSign = () => sign;

    return { getSign };
}

const gameBoard = (() => {
    const board = ['','','','','','','','',''];

    const setField = (index, sign) => board[index] = sign;

    const getField = (index) => board[index];

    const resetFields = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    }
    return {setField, getField, resetFields}
})();

const gameStart = (() => {
    const cells = document.querySelectorAll('.cell');
    const messageElement = document.querySelector('.message');
    const restartButton = document.querySelector('#restart');

    cells.forEach(each => {
        each.addEventListener('click',(event) => {
            if (event.target.innerHTML == '' && gameController.getIsOver() == false) {
                gameController.playRound(parseInt(event.target.id));
                updateBoard();
            }
        });
    })

    restartButton.addEventListener('click', (event) => {
        gameBoard.resetFields();
        gameController.reset();
        updateBoard();
        messageElement.innerHTML = 'It is the turn of X';
    })

    const updateBoard = () => {
        for (let i = 0; i < 9; i++) {
            cells[i].innerHTML = gameBoard.getField(i);
        }
    }

    const setMessage = (msg) => {
        messageElement.innerHTML = msg;
    }

    return { setMessage }
})();

const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let isOver = false;

    const playRound = (chosenIndex) => {
        gameBoard.setField(chosenIndex, getPlayerSign());
        if (checkWinner(chosenIndex)) {
            isOver = true;
            gameStart.setMessage(`${getPlayerSign()} has won!`);
            return;
        }
        round++;
        if (round == 10) {
            gameStart.setMessage("It's a draw!");
            isOver = true;
            return;
        }
        gameStart.setMessage(`It is the turn of ${getPlayerSign()}`);
    }

    const getPlayerSign = () => {
        return round % 2 == 1 ? playerX.getSign() : playerO.getSign();
    }

    const reset = () => {
        round = 1;
        isOver = false;
    }

    const checkWinner = (chosenIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
        const possibleWins = winConditions.filter(each => {
            return each.includes(chosenIndex);
        })
        return possibleWins.some(each => {
            return each.every(index => {
                return gameBoard.getField(index) == getPlayerSign();
            })
        })

    }

    const getIsOver = () => {
        return isOver;
    }

    return { playRound, reset, getIsOver}
})();