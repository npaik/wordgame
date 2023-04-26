const canvas = document.getElementById("gameBlock");
const ctx = canvas.getContext("2d");
const currentInputElement = document.getElementById("inputWords");
const startButton = document.getElementById("startButton");
const scoreElement = document.getElementById("scoreValue");
const timerElement = document.getElementById("timerValue");
const restartButton = document.getElementById("restartButton");
const highScoreElement = document.getElementById("highScoreValue");
const inputWordsElement = document.getElementById("inputWords");
const animatedWordsContainer = document.getElementById(
  "animatedWordsContainer"
);

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
let highScore = 0;
let gameInterval;
let gameOver = false;
let cannonball = null;

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
      cannonball = {
        x: canvas.width / 2,
        y: canvas.height - 20,
        targetX: fallingWords[wordIndex].x,
        targetY: fallingWords[wordIndex].y,
      };

      // Add the vanishing words animation
      const wordElement = document.createElement("span");
      wordElement.textContent = fallingWords[wordIndex].word;
      wordElement.style.left = `${fallingWords[wordIndex].x}px`;
      wordElement.style.top = `${fallingWords[wordIndex].y}px`;
      wordElement.classList.add("breakingWord");
      animatedWordsContainer.appendChild(wordElement);

      fallingWords.splice(wordIndex, 1);
      score++;
      scoreElement.textContent = score;
    }
    currentInput = "";
  }

  currentInputElement.textContent = currentInput;
});

/**
 * Function to draw the cannonball on the canvas
 */

function drawCannonball() {
  if (cannonball) {
    ctx.beginPath();
    ctx.arc(cannonball.x, cannonball.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
  }
}

/**
 * Function to draw and clear the falling words on the canvas
 */

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFallingWords();
  drawCannonball();
}

/**
 * Function to update the position of the cannonball
 */

function updateCannonball() {
  if (cannonball) {
    const dx = cannonball.targetX - cannonball.x;
    const dy = cannonball.targetY - cannonball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      cannonball = null;
    } else {
      const moveX = (dx / distance) * 5;
      const moveY = (dy / distance) * 5;
      cannonball.x += moveX;
      cannonball.y += moveY;
    }
  }
}

/**
 * Function to update the position of falling words and check for game over
 */

function update() {
  updateFallingWords();
  updateCannonball();

  if (fallingWords.some((wordObj) => wordObj.y > canvas.height)) {
    gameOver = true;
    gameOverDisplay();
  }
}

function fetchHighScore() {
  fetch("/get-high-score")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        highScore = data.highScore;
        const name = data.name ? ` - ${data.name}` : "";
        highScoreElement.textContent = `${highScore}${name}`;
      }
    })
    .catch((error) => console.error("Error fetching high score:", error));
}

async function saveHighScore(name, score) {
  try {
    const response = await fetch("/save-high-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, score }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Congratulations! You have reached the highest score.");
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error(error);
  }
}

function handleHighScoreName(score) {
  const name = prompt(
    "Congratulations! You have reached the highest score. Please enter your name:"
  );

  if (name) {
    saveHighScore(name, score);
  } else {
    alert("Please enter a valid name to save your high score.");
  }
}

/**
 * Function to display game over message
 */

function gameOverDisplay() {
  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = highScore;
    saveHighScore();
  }
  startButton.disabled = false;
  highScoreElement.parentElement.style.display = "block";
  const gameOverDiv = document.createElement("div");
  gameOverDiv.innerHTML = "Game Over";
  gameOverDiv.classList.add("gameOver");
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
  startButton.textContent = "Restart";
  startButton.removeEventListener("click", startGame);
  startButton.addEventListener("click", restartGame);

  startButton.disabled = true;
  addFallingWord();
  gameLoop();
  scoreElement.style.display = "block";
  countdown();
}

/**
 * Function to restart the game
 */

function restartGame() {
  gameOver = false;
  startButton.disabled = false;
  highScoreElement.parentElement.style.display = "block";
  score = 0;
  scoreElement.textContent = score;
  timerElement.textContent = "0:30";
  currentInputElement.textContent = "";
  currentInput = "";
  const gameOverDiv = document.querySelector(".gameOver");
  if (gameOverDiv) {
    gameOverDiv.remove();
  }
  startGame();
}

startButton.addEventListener("click", startGame);
fetchHighScore();
