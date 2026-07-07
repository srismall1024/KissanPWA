const {
GoogleGenerativeAI
} = require("@google/generative-ai");

const genAI =
new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);

const model =
genAI.getGenerativeModel({
model: "gemini-2.0-flash"
});

async function askGemini(question) {

console.log("Question:", question);

const result =
    await model.generateContent(question);

console.log("RESULT OBJECT:");
console.log(result);

console.log("RESPONSE OBJECT:");
console.log(result.response);

console.log(
    "TEXT PROPERTY TYPE:",
    typeof result.response.text
);

return result.response.text();

}

module.exports = {
askGemini
};
console.log(process.env.GEMINI_API_KEY);