# PhishShield: AI-Powered Phishing Detection

PhishShield is a robust security application designed to protect users from online scams. By leveraging the full power of the **Microsoft Azure Cloud Ecosystem**, it provides real-time analysis of suspicious text and images to detect phishing threats in any language.

## 🚀 Live Demo Link: **[Launch PhishShield](https://salmon-ground-06a903f00.1.azurestaticapps.net)**

---

## ☁️ Powered by Microsoft Azure

This project is built 100% on Microsoft technologies, utilizing enterprise-grade cloud services for hosting, compute, and intelligence.

### 1. Hosting & Serverless Architecture
-   **Azure Static Web Apps**: 
    -   Hosts the **Next.js** frontend application.
    -   Provides global content distribution and automatic SSL.
-   **Azure Functions**: 
    -   Powers the **Node.js** serverless backend.
    -   Scales automatically to handle analysis requests without managing servers.

### 2. Azure AI Services (The Brains)
-   **Azure AI Language**: 
    -   Analyzes email and message content to detect urgency, typical scam patterns, and negative sentiment.
-   **Azure AI Vision**: 
    -   Scans uploaded screenshots (OCR) to extract text and identifies visual danger signs like fake login forms.
-   **Azure AI Translator**: 
    -   **Multilingual Support**: Instantly normalizes input text to English for analysis and translates security warnings back to the user's native language.

### 3. Development Stack
-   **TypeScript**: Ensures code reliability and type safety across the full stack.
-   **Visual Studio Code**: The development environment of choice.
-   **Azure Static Web Apps CLI**: For local simulation and seamless production deployments.

---


## 💻 Local Development Guide

To run this project on your local machine:

### Prerequisites
-   **Node.js** (v18 or v20 recommended)
-   **Azure Functions Core Tools** (`npm install -g azure-functions-core-tools`)

### 1. Backend Setup (Azure Functions)
```bash
cd backend
npm install
npm start
```
*The backend will start at `http://localhost:7071`*

### 2. Frontend Setup (Next.js)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*The website will be available at `http://localhost:3000`*

---

## 📦 Deployment Guide

This project is optimized for deployment using the **Azure Static Web Apps CLI**.

### Build & Deploy
1.  **Build the Frontend**:
    ```bash
    cd frontend
    npm run build
    ```
2.  **Deploy to Azure**:
    ```bash
    # From the root directory
    swa deploy ./frontend/out --env production --deployment-token <YOUR_TOKEN>
    ```

---

## 🛡️ Security & Privacy
-   **Secure Configuration**: API keys and secrets are managed via Azure Application Settings.
-   **Ephemeral Processing**: User data sent for analysis is processed in memory and not permanently stored.

---

## 📝 License
Created for the **Microsoft Hackathon**.
