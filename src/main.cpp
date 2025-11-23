#include <iostream>
#include "tokenizer.h"

using namespace std;

void train(const string&);
string predict(const string&);

int main(int argc, char* argv[]) {

    cout << "Training model...\n";
    train("D:/CPP_AI_SPAM_DETECTOR/dataset/SMSSpamCollection");  // ABSOLUTE PATH FIX
    cout << "Model trained successfully!\n";

    // --------------------------------------------
    // MODE 1: Node.js backend passes message in argv[1]
    // --------------------------------------------
    if (argc > 1) {
        string message;
        for (int i = 1; i < argc; i++) {
            if (i > 1) message += " ";
            message += argv[i];
        }

        cout << "Prediction: " << predict(message) << "\n";
        return 0;
    }

    // --------------------------------------------
    // MODE 2: Interactive terminal mode
    // --------------------------------------------
    while (true) {
        string msg;
        cout << "Enter message: ";
        getline(cin, msg);

        cout << "Prediction: " << predict(msg) << "\n\n";
    }

    return 0;
}
