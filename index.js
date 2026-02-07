const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

/*
  Queue donate (FIFO)
  Anti skip kalau donate masuk cepat
*/
let donateQueue = [];

// Saweria webhook
app.post("/saweria", (req, res) => {
  const data = req.body;

  if (data && data.username && data.amount) {
    donateQueue.push({
      username: data.username,
      amount: data.amount,
      message: data.message || "",
      timestamp: Date.now()
    });

    console.log("[Saweria] Donate queued:", data.username, data.amount);
  }

  res.status(200).send("OK");
});

// Roblox polling
app.get("/latest", (req, res) => {
  if (donateQueue.length > 0) {
    res.json(donateQueue.shift());
  } else {
    res.status(204).send();
  }
});

app.listen(PORT, () => {
  console.log(`Saweria relay running on port ${PORT}`);
});
