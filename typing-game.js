const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const scoreElement = document.getElementById("score");
const currentInputElement = document.getElementById("current-input");
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
  "Yavin IV",
  "Jakku",
  "Takodana",
  "D'Qar",
  "Crait",
  "Exegol",
  "Scarif",
  "Eadu",
  "Wobani",
  "Jedha",
  "Pasaana",
  "Kijimi",
  "Kef Bir",
];

let fallingWords = [];
let currentInput = "";
let score = 0;
let gameInterval;

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function addFallingWord() {
  const randomIndex = Math.floor(Math.random() * planetsAndStars.length);
  const randomPlanetOrStar = planetsAndStars[randomIndex];
  fallingWords.push({
    word: randomPlanetOrStar,
    x: Math.random() * (canvas.width - 100),
    y: 0,
  });

  scoreElement.innerText = "Score: " + score;

  setTimeout(addFallingWord, randomDelay(700, 1500));
}

function addFallingWordWithRandomDelay() {
  setTimeout(addFallingWord, randomDelay(700, 1500));
}

function drawFallingWords() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  fallingWords.forEach((wordObj) => {
    ctx.fillText(wordObj.word, wordObj.x, wordObj.y);
  });
}

function updateFallingWords() {
  const difficultyMultiplier = 0.5 + score / 3;
  fallingWords.forEach((wordObj) => {
    wordObj.y += 0.1 * difficultyMultiplier;
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
  } else if (e.key.length === 1) {
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFallingWords();
  drawCurrentInput();
}

function drawCurrentInput() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(currentInput, canvas.width / 2, canvas.height + 25);
  ctx.textAlign = "left";
}

function displayFinalScore(finalScore) {
  const scoreDiv = document.createElement("div");
  scoreDiv.innerText = "Final Score: " + finalScore;
  scoreDiv.style.position = "absolute";
  scoreDiv.style.top = "50%";
  scoreDiv.style.left = "50%";
  scoreDiv.style.transform = "translate(-50%, -50%)";
  scoreDiv.style.fontSize = "40px";
  scoreDiv.style.fontWeight = "bold";
  document.body.appendChild(scoreDiv);
}

function gameOver() {
  clearInterval(gameInterval);
  fallingWords = [];
  currentInput = "";
  currentInputElement.textContent = currentInput;
  displayFinalScore(score);
  score = 0;
  scoreElement.textContent = score;
}

function update() {
  updateFallingWords();

  if (fallingWords.some((wordObj) => wordObj.y > canvas.height)) {
    gameOver();
    location.reload();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  startButton.disabled = true;
  addFallingWordWithRandomDelay();
  gameLoop();
  scoreElement.style.display = "block";
}

startButton.addEventListener("click", startGame);
