export interface AnalysisResult {
    riskScore: number; // 0-100
    riskLevel: 'Safe' | 'Suspicious' | 'Dangerous';
    explanation: string;
    details?: any;
}

export interface TextAnalysisRequest {
    text: string;
    language?: string;
}

export interface ImageAnalysisRequest {
    imageData: string; // Base64
}

export interface FeedbackRequest {
    analysisId: string;
    isCorrect: boolean;
    comments?: string;
}
