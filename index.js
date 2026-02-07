// ================= DEBUG LOG =================
console.log("Starting Saweria relay...");
console.log("PORT =", process.env.PORT);
console.log("DISCORD_TOKEN exists?", !!process.env.DISCORD_TOKEN);

// ================= REQUIRE =================
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

// ================= EXPRESS SERVER =================
const app = express();
const PORT = process.env.PORT || 8080;

// ================= SIMPAN DONASI TERAKHIR =================
let donateQueue = [];

// ================= DISCORD BOT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

// ================= CHANNEL DONASI =================
// GANTI DENGAN CHANNEL ID DONASI
const DONATION_CHANNEL_ID = "123456789012345678"; // <-- update dengan channel ID baru

client.on("messageCreate", (message) => {
  if (message.channel.id !== DONATION_CHANNEL_ID) return;
  if (!message.author.bot) return; // HARUS !message.author.bot

  const text = message.content;

  donateQueue.push({
    raw: text,
    time: Date.now()
  });

  console.log("💰 Donate captured from Discord:", text);
});

// ================= ENDPOINT UNTUK ROBLOX =================
app.get("/latest", (req, res) => {
  if (donateQueue.length > 0) {
    res.json(donateQueue.shift());
  } else {
    res.sendStatus(204);
  }
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});

// ================= LOGIN BOT =================
client.login(process.env.DISCORD_TOKEN)
  .catch(err => {
    console.error("❌ Bot failed to login:", err);
  });