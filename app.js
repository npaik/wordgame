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
  const { highScore } = req.body;
  try {
    const [result] = await database.query(
      "INSERT INTO high_scores (score) VALUES (?)",
      [highScore]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/get-high-score", async (req, res) => {
  try {
    const [rows] = await database.query(
      "SELECT MAX(score) as highScore FROM high_scores"
    );
    res.json({ success: true, highScore: rows[0].highScore || 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
