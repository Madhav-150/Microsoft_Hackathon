# Azure AI Services Prerequisites

To enable PhishShield, please provide the following Environment Variables.

## 1. Azure AI Language (for Text Analysis)
- **Endpoint**: `https://<your-resource-name>.cognitiveservices.azure.com/`
- **Key**: `YOUR_LANGUAGE_SERVICE_KEY`

## 2. Azure AI Vision (for Image Analysis)
- **Endpoint**: `https://<your-resource-name>.cognitiveservices.azure.com/`
- **Key**: `YOUR_VISION_SERVICE_KEY`

## 3. Azure AI Translator (for Multilingual Support)
*Ref: [Azure AI Translator Documentation](https://learn.microsoft.com/en-us/azure/ai-services/translator/)*
- **Endpoint**: `https://<your-resource-name>.cognitiveservices.azure.com/` (or global region endpoint)
- **Key**: `YOUR_TRANSLATOR_SERVICE_KEY`
- **Region**: `YOUR_TRANSLATOR_REGION` (Required for Translator)

---

### Update `backend/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "LANGUAGE_ENDPOINT": "...",
    "LANGUAGE_KEY": "...",
    "VISION_ENDPOINT": "...",
    "VISION_KEY": "...",
    "TRANSLATOR_ENDPOINT": "https://api.cognitive.microsofttranslator.com",
    "TRANSLATOR_KEY": "...",
    "TRANSLATOR_REGION": "...",
    "COSMOS_DB_CONNECTION_STRING": "..."
  }
}
```
