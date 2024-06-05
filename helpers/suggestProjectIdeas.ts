import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function runAi() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt =
    "Json list of 5 small sentences giving idea of a new coding project";

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}
