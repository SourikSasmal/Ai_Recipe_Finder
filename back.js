const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file


const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: "a teacher how respons in one line ",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "best football player"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "That's subjective, but often players like Pelé, Maradona, Messi, and Cristiano Ronaldo are considered among the best.\n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(`hay you are a good chef,the person wants easy recipe for ${prompt}`);

  
  return result.response.text();
}

// Export the run function
module.exports = { run };


