import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";

const gemini_api_key =
  process.env.GEMINI_API_KEY || "AIzaSyBOPiy1_F3ZPe1qFQon27vm_md_fe2oFIM";
const googleAI = new GoogleGenerativeAI(gemini_api_key);

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  //   temperature: 0.9,
  //   topP: 1,
  //   topK: 1,
  //   maxOutputTokens: 4096,
});

export const askAI = async (req: Request, res: Response): Promise<Response> => {
  const { searchQuery } = req.body;

  try {
    // const askAiDomainUrl = process.env.ASK_AI_DOMAIN_URL || '';
    // const askAiApiKey = process.env.ASK_AI_API_KEY || '';
    // const response = await axios.post(askAiDomainUrl, {
    //     model: 'gpt-4',
    //     messages: [
    //         {
    //             role: 'user',
    //             content: searchQuery
    //         }
    //     ]
    // }, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${askAiApiKey}`
    //     }
    // });

    // return res.status(200).json({ result: response.data.choices[0].message.content });
    const prompt = searchQuery;
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return res.status(200).json({ result: response.text() });
  } catch (error: any) {
    console.error("Error asking AI:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
