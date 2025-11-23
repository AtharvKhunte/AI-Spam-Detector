const express = require("express");
const app = express();
const { execFile } = require("child_process");
const path = require("path");

app.use(express.json());
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  next();
});

app.post("/check", (req, res) => {
  console.log("[Request] /check body:", req.body);
  const msg = (req.body.message || "").toString();

  // Absolute exe path
  const exePath = "D:/CPP_AI_SPAM_DETECTOR/build/spam_detector.exe";

  // Log exactly what we're going to call
  console.log("[Calling exe] path:", exePath);
  console.log("[Calling exe] arg:", msg);

  // Use execFile with args array (no shell)
  execFile(exePath, [msg], { timeout: 7000 }, (err, stdout, stderr) => {
    if (err) {
      console.error("[ExecFile error]", err);
      return res.status(500).json({ result: "ERROR" });
    }
    console.log("[ExecFile stdout]", stdout);
    console.log("[ExecFile stderr]", stderr);

    const m = stdout.match(/Prediction:\s*(SPAM|HAM)/i);
    if (m) {
      console.log("[Replying] ->", m[1].toUpperCase());
      return res.json({ result: m[1].toUpperCase() });
    }

    // Return raw stdout to help debug
    return res.json({ result: "UNKNOWN", raw: stdout });
  });
});

app.get("/", (req,res)=> res.send("Spam detector backend"));
app.listen(3000, ()=> console.log("Server running on port 3000"));
