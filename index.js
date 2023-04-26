require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const database = require("./database");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/save-high-score", async (req, res) => {
  const { name, score } = req.body;
  try {
    const [result] = await database.query(
      "INSERT INTO high_scores (name, score) VALUES (?, ?)",
      [name, score]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/get-high-score", async (req, res) => {
  try {
    const [rows] = await database.query(
      "SELECT name, score FROM high_scores ORDER BY score DESC LIMIT 1"
    );
    if (rows.length > 0) {
      res.json({ success: true, name: rows[0].name, highScore: rows[0].score });
    } else {
      res.json({ success: true, name: null, highScore: 0 });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/get-top-scores", async (req, res) => {
  try {
    const [rows] = await database.query(
      "SELECT name, score FROM high_scores WHERE name IS NOT NULL ORDER BY score DESC LIMIT 10"
    );
    const highScores = rows.map(({ name, score }) => ({ name, score }));
    res.json({ success: true, highScores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/planets-and-stars", (req, res) => {
  const planetsAndStars = JSON.parse(process.env.PLANETS_AND_STARS);
  res.json(planetsAndStars);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
