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
exports.submitFeedback = void 0;
const functions_1 = require("@azure/functions");
function submitFeedback(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log(`Http function processed request for url "${request.url}"`);
        try {
            const body = yield request.text();
            const parsedBody = body ? JSON.parse(body) : {};
            const { analysisId, isCorrect, comments } = parsedBody;
            // Feedback is not saved to DB in this version
            context.log(`Feedback received for ${analysisId}: Correct=${isCorrect}`);
            return {
                status: 200,
                body: JSON.stringify({
                    message: "Feedback received",
                    id: analysisId || "unknown"
                })
            };
        }
        catch (error) {
            context.error(error);
            return { status: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
        }
    });
}
exports.submitFeedback = submitFeedback;
;
functions_1.app.http('submitFeedback', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: submitFeedback
});
//# sourceMappingURL=submitFeedback.js.map