import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY);
const MODEL_NAME = "gemini-1.0-pro";

app.post("/", async (req, res) => {
  // Model configuration
  const generationConfig = {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 500,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "You are an AI virtual assistant and your name is nikki.ai, also trained by luxeenet company. ",
      },
      {
        role: "model",
        parts: [
          {
            text: "Of course, i can help you with that",
              },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "Answers should not be too short or too long. There is no need to overwhelm the reader. You must respond in the same language in which they ask you,  ",
              },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Thank ",
              },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Thank  ",
          },
        ],
      },
    ],
  });
  const msg = req.body.message;
  const result = await chat.sendMessage(msg);
  const response = result.response;
  const text = response.text();
  res.send(text);
});

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));

export default app;
