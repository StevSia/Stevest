import { GoogleGenAI, Type } from "@google/genai";
import { DividendInfo } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getDividendInsights = async (tickers: string[]): Promise<DividendInfo[]> => {
  const client = getClient();
  if (!client || tickers.length === 0) return [];

  const uniqueTickers = Array.from(new Set(tickers)).join(", ");

  const prompt = `
    Analyze these stock tickers: ${uniqueTickers}.
    Provide the most recent or upcoming dividend information for each.
    If a stock does not pay dividends, set yield to "0%".
    Return a JSON array.
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              companyName: { type: Type.STRING },
              yield: { type: Type.STRING },
              payDate: { type: Type.STRING, description: "Next pay date or recent pay date" },
              exDate: { type: Type.STRING, description: "Next or recent ex-dividend date" },
              amountPerShare: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as DividendInfo[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
