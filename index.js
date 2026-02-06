const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Temporary memory untuk donate terbaru
let latestDonate = null;

// Endpoint Saweria (POST)
app.post("/saweria", (req, res) => {
  const data = req.body; // { username, amount, message }
  latestDonate = data;
  console.log("Donate received:", data);
  res.status(200).send("OK");
});

// Endpoint Roblox (GET)
app.get("/latest", (req, res) => {
  if (latestDonate) {
    res.json(latestDonate);
    latestDonate = null; // reset supaya gak dikirim berkali-kali
  } else {
    res.status(204).send(); // no content
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});