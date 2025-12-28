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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = void 0;
const axios_1 = __importDefault(require("axios"));
const endpoint = process.env.TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com';
const key = process.env.TRANSLATOR_KEY;
const region = process.env.TRANSLATOR_REGION;
function translateText(text, toLanguage = 'en', fromLanguage) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!key || !region) {
            console.warn("Missing TRANSLATOR_KEY or TRANSLATOR_REGION. ROI: Returning original text.");
            return { translatedText: text, detectedLanguage: fromLanguage || 'en' };
        }
        try {
            const url = `${endpoint}/translate?api-version=3.0&to=${toLanguage}${fromLanguage ? `&from=${fromLanguage}` : ''}`;
            const response = yield axios_1.default.post(url, [{ 'Text': text }], {
                headers: {
                    'Ocp-Apim-Subscription-Key': key,
                    'Ocp-Apim-Subscription-Region': region,
                    'Content-Type': 'application/json'
                }
            });
            const result = response.data[0];
            const translatedText = result.translations[0].text;
            const detected = ((_a = result.detectedLanguage) === null || _a === void 0 ? void 0 : _a.language) || fromLanguage || 'en';
            return { translatedText, detectedLanguage: detected };
        }
        catch (error) {
            console.error("Translation Error:", error);
            // Fallback to original text on failure to ensure flow doesn't break
            return { translatedText: text, detectedLanguage: fromLanguage || 'en' };
        }
    });
}
exports.translateText = translateText;
//# sourceMappingURL=translator.js.map