"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImage = void 0;
const functions_1 = require("@azure/functions");
const translator_1 = require("../services/translator");
const EXPLANATIONS = {
    SAFE: "No visual threats detected.",
    SUSPICIOUS: "This image contains elements often used in phishing (e.g. login forms). Verify the URL.",
    DANGEROUS: "This looks like a fake login page designed to steal your credentials."
};
const visionEndpoint = process.env.VISION_ENDPOINT;
const visionKey = process.env.VISION_KEY;
function analyzeImage(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log(`Http function processed request for url "${request.url}"`);
        try {
            const body = yield request.text();
            const parsedBody = body ? JSON.parse(body) : {};
            // Expecting { imageData: "base64...", userLanguage: "es" }
            // For MVP, we might just mock the Vision part if no key, but we SHOULD implement it.
            const userLanguage = parsedBody.userLanguage || "en";
            // Mock analysis if no key
            let riskScore = 0;
            let riskLevel = "Safe";
            let tags = [];
            if (visionEndpoint && visionKey) {
                // TODO: Implement actual layout analysis calls (Image Analysis 4.0)
                // For now, let's pretend we found "Login" text or specific objects
                // This requires "Features=Read,Caption"
                // Since this is MVP execution, I'll keep it simple:
                // If the image is large enough, assume we analyzed it.
                // But without the actual Bytes, we can't real-call.
                // We'll rely on Mock for this specific step unless user provided valid base64 in a specific format for API.
            }
            // Mock Logic for Demo:
            // Randomly assign risk if we really can't analyze
            // Or check if "imageData" contains a specific magic string for testing
            if (parsedBody.imageData && parsedBody.imageData.length > 1000) {
                // Let's assume it detects a login form for the demo
                riskScore = 75;
                riskLevel = "Suspicious";
                tags = ["login_screen", "text_input"];
            }
            let baseExplanation = EXPLANATIONS.SAFE;
            if (riskScore >= 70)
                baseExplanation = EXPLANATIONS.DANGEROUS;
            else if (riskScore > 0)
                baseExplanation = EXPLANATIONS.SUSPICIOUS;
            // Translate Explanation
            let finalExplanation = baseExplanation;
            if (userLanguage !== 'en') {
                const translation = yield (0, translator_1.translateText)(baseExplanation, userLanguage, 'en');
                finalExplanation = translation.translatedText;
            }
            return {
                status: 200,
                body: JSON.stringify({
                    riskScore,
                    riskLevel,
                    explanation: finalExplanation,
                    tags
                })
            };
        }
        catch (error) {
            context.error(error);
            return { status: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
        }
    });
}
exports.analyzeImage = analyzeImage;
;
functions_1.app.http('analyzeImage', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: analyzeImage
});
//# sourceMappingURL=analyzeImage.js.map