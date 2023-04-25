const canvas = document.getElementById("game-block");
const ctx = canvas.getContext("2d");
const currentInputElement = document.getElementById("current-input");
const startButton = document.getElementById("start-button");
const scoreElement = document.getElementById("score-value");
const timerElement = document.getElementById("timer-value");
const planetsAndStars = [
  "Mercury",
  "Venus",
  "Earth",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Sun",
  "Moon",
  "Pluto",
  "Tatooine",
  "Alderaan",
  "Dagobah",
  "Hoth",
  "Endor",
  "Naboo",
  "Bespin",
  "Coruscant",
  "Kamino",
  "Geonosis",
  "Mustafar",
  "Jakku",
  "Takodana",
  "Crait",
  "Exegol",
  "Scarif",
  "Eadu",
  "Wobani",
  "Jedha",
  "Pasaana",
  "Kijimi",
];

let fallingWords = [];
let currentInput = "";
let score = 0;
let gameInterval;
let gameOver = false;

/**
 * Function to add a new falling word to the game
 */

function addFallingWord() {
  if (gameOver) return;

  const randomIndex = Math.floor(Math.random() * planetsAndStars.length);
  const randomPlanetOrStar = planetsAndStars[randomIndex];
  fallingWords.push({
    word: randomPlanetOrStar,
    x: Math.random() * (canvas.width - 100),
    y: 0,
  });

  scoreElement.innerText = score;

  setTimeout(addFallingWord, 1000);
}

/**
 * Function to draw the falling words on the canvas
 */

function drawFallingWords() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  fallingWords.forEach((wordObj) => {
    ctx.fillText(wordObj.word, wordObj.x, wordObj.y);
  });
}

/**
 * Function to update the position of falling words
 */

function updateFallingWords() {
  const difficultyMultiplier = 1.7 + score / 5;
  fallingWords.forEach((wordObj) => {
    wordObj.y += 0.1 * difficultyMultiplier;
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
  } else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
    currentInput += e.key;
  }

  if (e.key === "Enter") {
    const wordIndex = fallingWords.findIndex(
      (wordObj) => wordObj.word === currentInput
    );
    if (wordIndex !== -1) {
      fallingWords.splice(wordIndex, 1);
      score++;
      scoreElement.textContent = score;
    }
    currentInput = "";
  }

  currentInputElement.textContent = currentInput;
});

/**
 * Function to draw and clear the falling words on the canvas
 */

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFallingWords();
}

/**
 * Function to update the position of falling words and check for game over
 */

function update() {
  updateFallingWords();

  if (fallingWords.some((wordObj) => wordObj.y > canvas.height)) {
    gameOver = true;
    gameOverDisplay();
  }
}

/**
 * Function to display game over message
 */

function gameOverDisplay() {
  const gameOverDiv = document.createElement("div");
  gameOverDiv.innerHTML = "Game Over";
  gameOverDiv.classList.add("game-over");
  canvas.parentElement.appendChild(gameOverDiv);
  fallingWords = [];
  draw();
}

/**
 * Function to run the game loop
 */

function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

/**
 * Function to start the countdown timer
 */

function countdown() {
  let remainingTime = 30;
  timerElement.textContent = "0:30";

  const timerInterval = setInterval(() => {
    remainingTime--;

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    timerElement.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    if (remainingTime <= 0) {
      if (!gameOver) {
        gameOver = true;
        gameOverDisplay();
      }
      clearInterval(timerInterval);
    }
  }, 1000);
}

/**
 * Function to start the game
 */

function startGame() {
  startButton.disabled = true;
  addFallingWord();
  gameLoop();
  scoreElement.style.display = "block";
  countdown();
}

startButton.addEventListener("click", startGame);
