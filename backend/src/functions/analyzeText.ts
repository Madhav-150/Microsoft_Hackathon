import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AzureKeyCredential, TextAnalyticsClient } from "@azure/ai-text-analytics";
import { translateText } from "../services/translator";

// Static explanations to be translated
const EXPLANATIONS = {
    SAFE: "No phishing threats detected. The text appears normal.",
    SUSPICIOUS: "Be careful. This text contains urgent language or requests typical of scams.",
    DANGEROUS: "High risk detected! Accessing this link or replying may compromise your security."
};

const languageEndpoint = process.env.LANGUAGE_ENDPOINT;
const languageKey = process.env.LANGUAGE_KEY;

export async function analyzeText(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const body: any = await request.text();
        const parsedBody = body ? JSON.parse(body) : {};
        const rawText = parsedBody.text;

        if (!rawText) {
            return { status: 400, body: JSON.stringify({ error: "Please pass 'text' in the request body" }) };
        }

        // 1. Normalize to English
        const { translatedText, detectedLanguage } = await translateText(rawText, 'en');
        context.log(`Translated "${rawText}" (${detectedLanguage}) -> "${translatedText}"`);

        // 2. Analyze Intent (Using simple heuristics + AI Sentiment/KeyPhrases if available)
        let riskScore = 0;
        let riskLevel = 'Safe';
        let aiDetails: any = {};

        // Heuristic Check on English Text
        const urgentKeywords = ['urgent', 'verify', 'suspend', 'immediately', 'click here', 'password', 'bank', 'account', 'login', 'update'];
        const lowerText = translatedText.toLowerCase();
        const hitCount = urgentKeywords.reduce((acc, word) => lowerText.includes(word) ? acc + 1 : acc, 0);

        if (hitCount >= 1) {
            riskScore = 40;
            riskLevel = 'Suspicious';
        }
        if (hitCount >= 2) {
            riskScore = 75;
            riskLevel = 'Suspicious';
        }
        if (hitCount >= 3 || (lowerText.includes('password') && lowerText.includes('urgent'))) {
            riskScore = 85;
            riskLevel = 'Dangerous';
        }

        // Azure AI Language Service Integration
        if (languageEndpoint && languageKey) {
            try {
                const client = new TextAnalyticsClient(languageEndpoint, new AzureKeyCredential(languageKey));
                const results = await client.analyzeSentiment([translatedText]);
                const sentimentResult = results[0];

                // Check for error using type guard
                if (!("error" in sentimentResult)) {
                    // Safe to access sentiment
                    if (sentimentResult.sentiment === 'negative' && riskScore > 0) {
                        riskScore = Math.min(100, riskScore + 20);
                    }
                    aiDetails = { sentiment: sentimentResult };
                } else {
                    context.log("Language Service returned an error for this document:", sentimentResult.error);
                }
            } catch (err) {
                context.log("Language Service Error (Non-blocking):", err);
            }
        }

        // 3. Select Explanation
        let baseExplanation = EXPLANATIONS.SAFE;
        if (riskScore >= 70) baseExplanation = EXPLANATIONS.DANGEROUS;
        else if (riskScore > 0) baseExplanation = EXPLANATIONS.SUSPICIOUS;

        // 4. Translate Explanation back to User Language
        let finalExplanation = baseExplanation;
        if (detectedLanguage !== 'en') {
            const translation = await translateText(baseExplanation, detectedLanguage, 'en');
            finalExplanation = translation.translatedText;
        }

        return {
            status: 200,
            body: JSON.stringify({
                riskScore,
                riskLevel,
                explanation: finalExplanation,
                originalText: rawText,
                detectedLanguage,
                englishNormalization: translatedText,
                details: aiDetails
            })
        };
    } catch (error) {
        context.error(error);
        return { status: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
    }
};

app.http('analyzeText', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: analyzeText
});
