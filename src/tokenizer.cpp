#include "tokenizer.h"
#include <algorithm>
#include <sstream>
#include <cctype>

std::vector<std::string> tokenize(const std::string& text) {
    std::string cleaned;
    for(char c : text) {
        if(std::isalnum((unsigned char)c) || std::isspace((unsigned char)c))
            cleaned += std::tolower((unsigned char)c);
    }

    std::stringstream ss(cleaned);
    std::string word;
    std::vector<std::string> tokens;

    while(ss >> word) tokens.push_back(word);

    return tokens;
}
