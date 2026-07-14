const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

const statusStore = {};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.post("/webhook", (req, res) => {

  const body = req.body;

  const txId = body.transactionId;

  const status = (body.status || body.transaction?.status || "").toLowerCase();

  if (txId && status) {
    statusStore[txId] = status;
  }

  res.json({
    success: true,
  });

});

app.get("/status/:id", (req, res) => {

  res.json({
    status: statusStore[req.params.id] || null,
  });

});

app.get("*", (req, res) => {

  const relPath =
    req.path === "/"
      ? "index.html"
      : req.path.replace(/^\//, "");

  const file = path.join(__dirname, relPath);

  if (!fs.existsSync(file)) {
    return res.status(404).send("Not found");
  }

  const ext = path.extname(file);

  res.setHeader(
    "Content-Type",
    MIME[ext] || "application/octet-stream"
  );

  res.sendFile(file);

});

module.exports = app;

if (!process.env.VERCEL) {

  const PORT = process.env.PORT || 3005;

  app.listen(PORT, () => {
    console.log("Running on", PORT);
  });

}