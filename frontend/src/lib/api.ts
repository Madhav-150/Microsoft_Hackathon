export interface AnalysisResponse {
    riskScore: number;
    riskLevel: string;
    explanation: string;
    detectedLanguage?: string;
    details?: any;
    error?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:7071/api'; // Use Env var for Prod, localhost for Dev

export async function analyzeText(text: string): Promise<AnalysisResponse> {
    try {
        const res = await fetch(`${API_BASE}/analyzeText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error('Analysis failed');
        return await res.json();
    } catch (e) {
        console.error(e);
        return { riskScore: 0, riskLevel: 'Error', explanation: `Failed to connect to PhishShield Backend. Details: ${String(e)}`, error: String(e) };
    }
}

export async function analyzeImage(file: File): Promise<AnalysisResponse> {
    try {
        // Convert File to Base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        const imageData = await base64Promise;

        const res = await fetch(`${API_BASE}/analyzeImage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData, userLanguage: navigator.language })
        });
        if (!res.ok) throw new Error('Analysis failed');
        return await res.json();
    } catch (e) {
        console.error(e);
        return { riskScore: 0, riskLevel: 'Error', explanation: 'Failed to connect to PhishShield Backend.', error: String(e) };
    }
}

export async function submitFeedback(analysisId: string, isCorrect: boolean) {
    await fetch(`${API_BASE}/submitFeedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId, isCorrect })
    });
}
