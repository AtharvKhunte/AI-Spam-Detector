# 🚀 **AI Spam Detector (C++ + Node.js + Cyber Dashboard UI)**

### *Real-time SMS Spam Detection using Naive Bayes built from scratch in C++.*

<div align="center">

![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)
![C++](https://img.shields.io/badge/C%2B%2B-Naive%20Bayes-blue?style=for-the-badge)
![NodeJS](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge)
![Frontend](https://img.shields.io/badge/UI-Cyber%20Dashboard-0ea5e9?style=for-the-badge)
![Dataset](https://img.shields.io/badge/Dataset-UCI%20SMS%20Spam%20Collection-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

</div>

---

# 📌 **Overview**

This project is a full end-to-end AI Spam Detection System built with:

* **C++ (Naive Bayes Classifier)** — trains + predicts SPAM / HAM
* **Node.js REST API** — exposes the C++ model to the frontend
* **Modern Cyber-Dashboard Frontend** — gauge chart, animations, history, statistics
* **Offline, Fast, Local** — no internet needed for predictions

Everything runs **locally on Windows** and gives instant results.

---

# 📥 Dataset

Trained on the famous **SMS Spam Collection Dataset** from UCI ML Repository:
🔗 [https://archive.ics.uci.edu/dataset/228/sms+spam+collection](https://archive.ics.uci.edu/dataset/228/sms+spam+collection)

Download → place inside:

```
dataset/SMSSpamCollection
```

---

# 🧠 **Architecture**

```
 ┌─────────────────────────────┐
 │        Frontend UI          │
 │  HTML • CSS • JS (Cyber UI) │
 └──────────────┬──────────────┘
                │ fetch POST /check
                ▼
 ┌─────────────────────────────┐
 │         Node.js API         │
 │ execFile → runs C++ model   │
 │ returns JSON {result,prob}  │
 └──────────────┬──────────────┘
                │
                ▼
 ┌─────────────────────────────┐
 │      C++ ML Classifier      │
 │ Naive Bayes (tokenizer,     │
 │ training, probability calc) │
 └─────────────────────────────┘
```

---

# ✨ Features

### 🔥 **C++ Machine Learning Engine**

* Naive Bayes classifier
* Custom tokenizer
* Laplace smoothing
* Predicts SPAM / HAM
* Outputs probability scores

### ⚡ **Node.js Backend**

* `execFile` to trigger the C++ executable
* Clean JSON output
* CORS enabled
* Error handling + logs
* Fast & lightweight

### 🎨 **Modern Cyber Dashboard UI**

* Futuristic dashboard layout
* Animated **gauge meter**
* Confetti animation for spam 🎉
* Live stats → Total, Spam, Ham
* LocalStorage history (10 entries)
* Clean light/dark hybrid theme
* Fully responsive

### 📦 **Other Features**

* Batch CSV classification
* Beautiful UI polish
* Dataset-driven model
* Super fast predictions

---

# 📂 **Project Structure**

```
CPP_AI_SPAM_DETECTOR/
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── build/
│   └── spam_detector.exe     # C++ compiled model
│
├── dataset/
│   └── SMSSpamCollection     # training data
│
├── src/
│   ├── main.cpp
│   ├── tokenizer.cpp
│   ├── naive_bayes.cpp
│   └── tokenizer.h
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── include/
│   └── tokenizer.h
│
├── .gitignore
└── README.md
```

---

# ⚙️ **Installation & Setup**

## Step 1 — Install MSYS2 + g++

Check compiler:

```bash
g++ --version
```

If missing:

```bash
pacman -S mingw-w64-ucrt-x86_64-gcc
```

---

## Step 2 — Compile the C++ Model

```bash
cd /d CPP_AI_SPAM_DETECTOR
g++ src/*.cpp -I include -o build/spam_detector.exe
```

---

## Step 3 — Install & Run Backend

```bash
cd backend
npm install
node server.js
```

Backend runs at:
➡ **[http://localhost:3000/check](http://localhost:3000/check)**

---

## Step 4 — Start Frontend

```bash
cd frontend
npx http-server
```

Frontend opens at:
➡ **[http://127.0.0.1:8080](http://127.0.0.1:8080)**

---

# 🧪 **API Usage**

### **POST /check**

Send message for classification.

#### Request body:

```json
{
  "message": "You have won $5000 cash!"
}
```

#### Response:

```json
{
  "result": "SPAM",
  "raw": "Prediction: SPAM",
  "prob": 88
}
```

---

# 📸 Screenshots

<img width="1628" height="823" alt="image" src="https://github.com/user-attachments/assets/68e48585-383c-4a11-82d0-9fb9fb772cbb" />
<img width="1058" height="548" alt="image" src="https://github.com/user-attachments/assets/1c229ace-6f0f-431b-bf1a-e509e9111e41" />
<img width="1015" height="570" alt="image" src="https://github.com/user-attachments/assets/e7b1591b-daae-4b56-9b5d-91235a8d2658" />



# 🛠️ Tech Stack

### **Frontend**

* HTML5
* CSS3 (cyber theme)
* JavaScript
* Gauge animation
* LocalStorage

### **Backend**

* Node.js
* Express
* execFile

### **ML Engine**

* C++
* Naive Bayes

---

# 🚀 Future Improvements

* PDF report generator
* More ML models (SVM / Logistic Regression / BERT)
* Deployable cloud API
* User login + history sync
* Dark/Light theme switcher

---

# 📜 License

MIT License.
Open for usage, modification, and contributions.

---

# ✨ Author

**Atharv Khunte**

**Divya Pawar**


---
