import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function submitFeedback(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const body: any = await request.text();
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
    } catch (error) {
        context.error(error);
        return { status: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
    }
};

app.http('submitFeedback', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: submitFeedback
});
