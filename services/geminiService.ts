
import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation, Metric, SignificantMetric } from '../types';

const getSignificantMetrics = (metrics: Metric[]): SignificantMetric[] => {
    return metrics
        .filter(m => m.pValue < 0.05)
        .slice(0, 5) // Limit to 5 most significant for the prompt
        .map(m => ({
            name: m.name,
            bt: Number(m.backtestValue),
            rt: Number(m.realtimeValue),
            p_value: m.pValue,
        }));
};

const buildPrompt = (backtestMetrics: any, realtimeMetrics: any, driftScore: number): string => {
    const threshold = 0.05;

    const input = {
        backtest: backtestMetrics,
        realtime: realtimeMetrics,
        threshold: threshold,
    };

    const prompt = `
      <<SYSTEM>>
      You are AlgoGuardian AI, an expert risk-monitoring assistant for algorithmic trading. Your goal is to detect significant statistical deviation (drift) between a strategy's backtest and its realtime performance. Analyze the provided metrics, explain the drift, and recommend a course of action. Output JSON only.

      <<INPUT>>
      ${JSON.stringify(input, null, 2)}

      <<OUTPUT FORMAT>>
      {
        "status": "ok|drift",
        "drift_score": number,
        "significant_metrics": [{ "name": str, "bt": num, "rt": num, "p_value": num }],
        "explanation": "str<=50 words",
        "recommended_action": "hold|pause|stop"
      }
    `;
    return prompt;
};


export const getAIRecommendation = async (strategyMetrics: Metric[], driftScore: number): Promise<AIRecommendation> => {
    // Check for API key. In a real environment, this should be handled more robustly.
    if (!process.env.API_KEY) {
        console.warn("API_KEY environment variable not set. Returning mock AI data.");
        // Return mock data if API key is not available
        const significant_metrics = getSignificantMetrics(strategyMetrics);
        const hasDrift = driftScore >= 1.0;
        return {
            status: hasDrift ? 'drift' : 'ok',
            drift_score: driftScore,
            significant_metrics,
            explanation: hasDrift ? "Significant negative drift detected in risk metrics like Max Drawdown. The strategy is performing worse than historical tests, suggesting market conditions may have changed." : "Strategy is performing within expected historical parameters. No significant drift detected.",
            recommended_action: hasDrift ? 'pause' : 'hold'
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const backtestMetrics: { [key: string]: number } = {};
        const realtimeMetrics: { [key: string]: number } = {};
        strategyMetrics.forEach(m => {
            backtestMetrics[m.name] = Number(m.backtestValue);
            realtimeMetrics[m.name] = Number(m.realtimeValue);
        });

        const prompt = buildPrompt(backtestMetrics, realtimeMetrics, driftScore);

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text.trim();
        // Clean the response to make it valid JSON
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonString);
        return result as AIRecommendation;

    } catch (error) {
        console.error("Error fetching AI recommendation from Gemini:", error);
        // Fallback to mock data on API error
        const significant_metrics = getSignificantMetrics(strategyMetrics);
        const hasDrift = driftScore >= 1.0;
        return {
            status: hasDrift ? 'drift' : 'ok',
            drift_score: driftScore,
            significant_metrics,
            explanation: "An error occurred while generating the AI analysis. Please check the metrics manually. Significant drift may be present.",
            recommended_action: hasDrift ? 'pause' : 'hold'
        };
    }
};
