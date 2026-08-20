 🛡️ Blind Click Protector

**Blind Click Protector** is an AI-powered security tool designed to protect everyday users from predatory Terms of Service (ToS) and Privacy Policy agreements. By leveraging the power of Google Gemini, this tool scans, parses, and identifies hidden data traps, arbitration clauses, and intrusive tracking practices before you click "Accept."

🚀 Features

*   **AI-Powered Analysis:** Uses Google Gemini (Gemini 3.7 Flash) to analyze legal text for risk factors.
*   **Structured Reporting:** Extracts clear insights on:
    *   **Data Tracking:** What personal information is being monitored.
    *   **Data Selling:** Whether your data is shared or sold to third parties.
    *   **Red Flags:** Hidden legal traps like binding arbitration and class-action waivers.
*   **Browser Extension:** Works directly in your browser (Firefox/Chrome) to scan active pages instantly.
*   **Full-Stack Architecture:** Built with FastAPI (Backend) and a modern frontend, all containerized with Docker.

 🛠️ Technical Stack

*   **Backend:** Python, FastAPI, Google GenAI SDK, Pydantic.
*   **Frontend:** Next.js (Web App), WebExtensions API (Browser Extension).
*   **Infrastructure:** Docker & Docker Compose for isolated development.
*   **AI Engine:** Google Gemini API.

 📦 How it Works

1.  **Extraction:** The browser extension captures the text content of the currently open webpage.
2.  **Analysis:** The text is sent to the FastAPI backend.
3.  **Inference:** The backend prompts Gemini with a structured instruction, ensuring the output is valid JSON.
4.  **Reporting:** The user receives a concise, color-coded risk breakdown directly in the browser popup.

 ⚙️ Quick Start

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/yourusername/blind-click-protector.git
    cd blind-click-protector
    ```
2.  **Setup API Key:** Add your Gemini API key to your `docker-compose.yml` file.
3.  **Run Containers:**
    ```bash
    docker-compose up --build
    ```
4.  **Install Extension:** Load the `extension/` folder in your browser (Chrome/Firefox) via "Developer Mode" or "Load Temporary Add-on".

---
*Built with privacy in mind. Never click blindly again.*
