// server.js
const express = require("express");
const app = express();
const { execFile } = require("child_process");
const path = require("path");

app.use(express.json({ limit: "2mb" }));

// CORS (allow local dev)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.post("/check", (req, res) => {
  const msg = (req.body && req.body.message) ? String(req.body.message) : "";
  if (!msg.trim()) {
    return res.status(400).json({ result: "UNKNOWN", raw: "Empty message", prob: 0 });
  }

  const exePath = path.join(__dirname, "..", "build", "spam_detector.exe");
  console.log("[Request] /check, msg:", msg.slice(0,200));
  console.log("[Calling exe] path:", exePath);

  execFile(exePath, [msg], { windowsHide: true, maxBuffer: 1024 * 500 }, (err, stdout, stderr) => {
    if (err) {
      console.error("[ExecFile ERROR]", err);
      return res.status(500).json({ result: "ERROR", raw: (stderr || err.message).toString(), prob: 0 });
    }

    const out = (stdout || "").toString().trim();
    console.log("[ExecFile stdout]", out.replace(/\n/g, " / "));
    let upper = out.toUpperCase();
    let result = "UNKNOWN";
    if (upper.includes("SPAM")) result = "SPAM";
    else if (upper.includes("HAM")) result = "HAM";

    // If your C++ exe prints a numeric probability, you can parse it here.
    // For now use heuristic numeric prob: SPAM -> 88, HAM -> 14, UNKNOWN -> 50
    const prob = (result === "SPAM") ? 88 : (result === "HAM" ? 14 : 50);

    return res.json({ result, raw: out, prob });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
