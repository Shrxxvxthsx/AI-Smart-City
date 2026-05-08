import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeReport(category: string, description: string, location: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the AI Smart City Intelligence Engine. 
      Analyze the following citizen report and provide a structured JSON response.
      
      Category: ${category}
      Description: ${description}
      Location: ${location}
      
      Response Format (JSON):
      {
        "summary": "Short 1-sentence summary",
        "predictedImpact": "What will happen if not fixed",
        "suggestedActions": ["Action 1", "Action 2"],
        "severityScore": number (1-10),
        "priority": "low" | "medium" | "high" | "critical",
        "assignedDept": "Name of department"
      }`,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}

export async function getCityInsights(metrics: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these city metrics and provide strategic insights for sustainable governance inspired by ancient Indian water and solar wisdom.
      Metrics: ${JSON.stringify(metrics)}
      
      Provide 3 key insights.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Intelligence gathering in progress...";
  }
}
