// naive_bayes.cpp
#include <bits/stdc++.h>
#include "tokenizer.h"
using namespace std;

static unordered_map<string,int> hamCounts;
static unordered_map<string,int> spamCounts;
static unordered_set<string> vocabulary;
static int hamTotalWords = 0;
static int spamTotalWords = 0;
static int hamMessages = 0;
static int spamMessages = 0;

void train(const string& filePath) {
    hamCounts.clear();
    spamCounts.clear();
    vocabulary.clear();
    hamTotalWords = spamTotalWords = 0;
    hamMessages = spamMessages = 0;

    ifstream file(filePath);
    if (!file) {
        cerr << "train(): cannot open file: " << filePath << "\n";
        return;
    }

    string line;
    while (getline(file, line)) {
        if (line.empty()) continue;
        size_t pos = line.find('\t');
        if (pos == string::npos) continue;

        string label = line.substr(0, pos);
        string message = line.substr(pos + 1);

        vector<string> words = tokenize(message);
        if (label == "ham") {
            hamMessages++;
            for (auto &w : words) {
                vocabulary.insert(w);
                hamCounts[w]++;
                hamTotalWords++;
            }
        } else { // anything not "ham" => spam
            spamMessages++;
            for (auto &w : words) {
                vocabulary.insert(w);
                spamCounts[w]++;
                spamTotalWords++;
            }
        }
    }

    cerr << "[train] hamMessages=" << hamMessages
         << " spamMessages=" << spamMessages
         << " vocab=" << vocabulary.size()
         << " hamWords=" << hamTotalWords
         << " spamWords=" << spamTotalWords << "\n";
}

static double wordProb(const string& w, bool spamClass) {
    int V = (int)vocabulary.size();
    if (V == 0) V = 1;

    if (spamClass) {
        int count = 0;
        auto it = spamCounts.find(w);
        if (it != spamCounts.end()) count = it->second;
        return (count + 1.0) / (spamTotalWords + V);
    } else {
        int count = 0;
        auto it = hamCounts.find(w);
        if (it != hamCounts.end()) count = it->second;
        return (count + 1.0) / (hamTotalWords + V);
    }
}

string predict(const string& msg) {
    vector<string> words = tokenize(msg);
    if (spamMessages + hamMessages == 0) return "HAM";

    double priorSpam = (double)spamMessages / (spamMessages + hamMessages);
    double priorHam  = (double)hamMessages  / (spamMessages + hamMessages);

    double logSpam = log(priorSpam + 1e-12);
    double logHam  = log(priorHam  + 1e-12);

    for (auto &w : words) {
        double ps = wordProb(w, true);
        double ph = wordProb(w, false);
        logSpam += log(ps + 1e-12);
        logHam  += log(ph + 1e-12);
    }

    return (logSpam > logHam) ? "SPAM" : "HAM";
}
