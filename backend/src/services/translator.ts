import axios from 'axios';

const endpoint = process.env.TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com';
const key = process.env.TRANSLATOR_KEY;
const region = process.env.TRANSLATOR_REGION;

interface TranslationResult {
    detectedLanguage: { language: string, score: number };
    translations: { text: string, to: string }[];
}

export async function translateText(text: string, toLanguage: string = 'en', fromLanguage?: string): Promise<{ translatedText: string, detectedLanguage: string }> {
    if (!key || !region) {
        console.warn("Missing TRANSLATOR_KEY or TRANSLATOR_REGION. ROI: Returning original text.");
        return { translatedText: text, detectedLanguage: fromLanguage || 'en' };
    }

    try {
        const url = `${endpoint}/translate?api-version=3.0&to=${toLanguage}${fromLanguage ? `&from=${fromLanguage}` : ''}`;

        const response = await axios.post<TranslationResult[]>(url, [{ 'Text': text }], {
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Ocp-Apim-Subscription-Region': region,
                'Content-Type': 'application/json'
            }
        });

        const result = response.data[0];
        const translatedText = result.translations[0].text;
        const detected = result.detectedLanguage?.language || fromLanguage || 'en';

        return { translatedText, detectedLanguage: detected };
    } catch (error) {
        console.error("Translation Error:", error);
        // Fallback to original text on failure to ensure flow doesn't break
        return { translatedText: text, detectedLanguage: fromLanguage || 'en' };
    }
}
