const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let scores = [];

app.get("/", (req, res) => {
  res.send("Zone Royale API Running 🚀");
});

app.post("/api/scores", (req, res) => {
  const { name, kills } = req.body;

  if (!name || kills < 0 || kills > 100) {
    return res.status(422).json({ error: "Invalid data" });
  }

  scores.push({ name, kills });
  scores.sort((a, b) => b.kills - a.kills);

  res.json({ success: true });
});

app.get("/api/scores/leaderboard", (req, res) => {
  res.json(scores.slice(0, 10));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
