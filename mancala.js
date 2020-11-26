const INITIAL_STONES_COUNT = 4;
const NUMBER_OF_PLAYERS = 2;

let players = {
  0: { stones: [], score: 0 },
  1: { stones: [], score: 0 },
};

let grid = document.querySelector(".grid-container");

let turnEnd = 1;
let turnEndText = document.querySelector("#turn");

let playersStonesView = { 0: [], 1: [] };
const NUMBER_OF_STONES = 6;
for (let i = 0; i < NUMBER_OF_PLAYERS; i++)
  for (let j = 0; j < NUMBER_OF_STONES; j++) {
    playersStonesView[i][j] = document.querySelector(`.player${i + 1}-${j}`);
  }

let player1scorePot = document.querySelector(`.player1score`);
let player2scorePot = document.querySelector(`.player2score`);
player2scorePot.innerHTML = "0";
player1scorePot.innerHTML = "0";

let body = document.querySelector("body");

initialGame();
function initialGame() {
  for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
    players[i].score = 0;
    for (let j = 0; j < NUMBER_OF_STONES; j++) {
      players[i].stones[j] = INITIAL_STONES_COUNT;
    }
  }
  updateBoard();
  turnEnd = 1;
  grid.addEventListener("click", play);
}

function turnEndUpdate() {
  console.log(turnEnd);
  if (turnEnd === 1 || turnEnd === NUMBER_OF_PLAYERS)
    turnEndText.innerHTML = `Player ${turnEnd} turn.`;
  else turnEndText.innerHTML = turnEnd;
}

function updateBoard() {
  for (let i = 0; i < NUMBER_OF_PLAYERS; i++)
    for (let j = 0; j < NUMBER_OF_STONES; j++) {
      playersStonesView[i][j].innerHTML = players[i].stones[j];
      if (turnEnd === 1) {
        playersStonesView[0][j].style.cursor = "pointer";
        playersStonesView[1][j].style.cursor = "not-allowed";
      } else if (turnEnd === NUMBER_OF_PLAYERS) {
        playersStonesView[1][j].style.cursor = "pointer";
        playersStonesView[0][j].style.cursor = "not-allowed";
      } else {
        playersStonesView[i][j].style.cursor = "";
      }
    }
  player1scorePot.innerHTML = players[0].score;
  player2scorePot.innerHTML = players[1].score;
  turnEndUpdate();
}

function updateCell(row, cell, timer, lastStone) {
  setTimeout(() => {
    function changStyle(element) {
      // TODO - replace inline style with classes in css file and element.classList.add()
      element.style.border = "4px dotted blue";
      element.style.color = "color: yellow bold";
      element.style.fontWeight = "bold";
    }

    function cleanStyle() {
      function resetInlineStylesOf(element) {
        console.log(element);
        element.style.border = "";
        element.style.color = "";
        element.style.fontWeight = "";
      }
      for (let i = 0; i < NUMBER_OF_PLAYERS; i++)
        for (let j = 0; j < NUMBER_OF_STONES; j++) {
          resetInlineStylesOf(playersStonesView[i][j]);
        }
      resetInlineStylesOf(player1scorePot);
      resetInlineStylesOf(player2scorePot);
    }

    cleanStyle();

    if (cell >= 0 && cell <= 5) {
      playersStonesView[row][cell].innerHTML = players[row].stones[cell];
      changStyle(playersStonesView[row][cell]);
    }

    if (cell === -1) {
      if (row === 0) {
        player1scorePot.innerHTML = players[0].score;
        changStyle(player1scorePot);
      } else {
        player2scorePot.innerHTML = players[1].score;
        changStyle(player2scorePot);
      }
    }
    if (lastStone === 1) {
      setTimeout(() => {
        updateBoard();
        cleanStyle();
        grid.addEventListener("click", play);
      }, 400);
    }
  }, 400 * timer);
}

function isGameOver() {
  let gameOver = true;
  let clearLine;
  let winner;
  for (let i = 0; i < NUMBER_OF_STONES; i++) {
    if (players[0].stones[i] !== 0) gameOver = false;
  }
  clearLine = gameOver ? 0 : 1;
  const otherPlayer = clearLine === 0 ? 1 : 0;
  if (!gameOver) {
    gameOver = true;
    for (let i = 0; i < NUMBER_OF_STONES; i++) {
      if (players[1].stones[i] !== 0) gameOver = false;
    }
  }
  if (gameOver) {
    for (let i = 0; i < NUMBER_OF_STONES; i++)
      players[otherPlayer].score += players[otherPlayer].stones[i];
    for (let i = 0; i < NUMBER_OF_PLAYERS; i++)
      for (let j = 0; j < NUMBER_OF_STONES; j++) players[i].stones[j] = 0;
    if (players[0].score === players[1].score) {
      turnEnd = `There is a tie.`;
      turnEndUpdate();
    } else {
      winner = players[0].score > players[1].score ? 1 : NUMBER_OF_PLAYERS;
      turnEnd = `Player ${winner} is the winner.`;
      turnEndUpdate();
    }
    grid.removeEventListener("click", play);
    const button = document.createElement("button");
    button.innerHTML = "New Game";
    button.addEventListener(`click`, () => {
      initialGame();
      body.removeChild(button);
    });
    body.appendChild(button);
  }
}

function checkGame() {
  let totalStones = 0;
  for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
    totalStones += players[i].score;
    for (let j = 0; j < NUMBER_OF_STONES; j++) {
      totalStones += players[i].stones[j];
    }
  }
  if (totalStones !== 48) console.log("we have a problem");
}

turnEndText.addEventListener("click", function () {
  for (let p = 0; p < 100; p++) {
    setTimeout(() => {
      let j = Math.floor(Math.random() * NUMBER_OF_STONES);
      // TODO - rows is not declared - I think this will crash
      rows[0].children[j].click();
      rows[1].children[j].click();
    }, 1000);
  }
});

function play(e) {
  let cell = parseInt(e.target.className.charAt(8));
  let row = e.target.className.charAt(NUMBER_OF_STONES) - 1;

  if (players[row].stones[cell] > 0 && row === turnEnd - 1) {
    // A good click
    grid.removeEventListener("click", play);
    let currentMoveStones = players[row].stones[cell];
    let timer = 0;
    players[row].stones[cell] = 0;
    turnEnd = row === 0 ? NUMBER_OF_PLAYERS : 1;
    // TODO - currentPlayer and otherPlayer are not declared
    currentPlayer = row === 0 ? 0 : 1;
    otherPlayer = row === 0 ? 1 : 0;

    updateCell(row, cell, timer, currentMoveStones);
    cell--;
    while (currentMoveStones > 0) {
      timer++;
      if (
        currentMoveStones === 1 && //when finish on empty cell
        currentPlayer === row &&
        players[currentPlayer].stones[cell] === 0 &&
        players[otherPlayer].stones[5 - cell] > 0
      ) {
        players[currentPlayer].score +=
          players[otherPlayer].stones[5 - cell] + 1;
        players[otherPlayer].stones[5 - cell] = 0;
        updateCell(row, cell, timer, currentMoveStones);
        updateCell(otherPlayer, 5 - cell, timer, currentMoveStones);
      } else if (cell >= 0 && cell <= 5 && currentMoveStones > 0) {
        // run the row
        players[row].stones[cell]++;
        updateCell(row, cell, timer, currentMoveStones);
      } else if (cell === -1) {
        // when gets to a player cell

        if (currentPlayer === row) {
          players[currentPlayer].score++;
          updateCell(row, cell, timer, currentMoveStones);
          if (currentMoveStones === 1) {
            turnEnd = turnEnd === 1 ? NUMBER_OF_PLAYERS : 1;
          }
          cell = NUMBER_OF_STONES;
        } else {
          currentMoveStones++;
          cell = NUMBER_OF_STONES;
        }
        row = row === 0 ? 1 : 0;
      }
      cell--;
      currentMoveStones--;
    }
    checkGame();
    isGameOver();
  }
}
