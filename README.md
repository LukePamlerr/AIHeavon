# AIHeavon 🌌

**AIHeavon** is a sleek, modern, and advanced AI chat interface that aggregates top-tier AI models from OpenRouter, Hugging Face, and more. It features a high-performance aesthetic design with a neon lime on black theme.

![AIHeavon Interface](https://cdn.discordapp.com/attachments/1473596099720773722/1476234330891358433/Screenshot_2026-02-25_070659.png?ex=69a061db&is=699f105b&hm=0aea1f32e701595bf8c8769badf8f89b66fc4a7bf8f30495060f05ca27faf6be)

## 🚀 Features

-   **Multi-Model Support**: Access GPT-4, Claude 3, Mistral, Llama 3, Gemini, and more through OpenRouter and HuggingFace.
-   **Bring Your Own Key (BYOK)**: Securely use your own API keys. Keys are stored locally in your browser and never sent to our servers.
-   **Free Model Access**: curated list of high-quality free models (requires OpenRouter account).
-   **Chat History**: Persistent local chat history.
-   **Markdown & Code Highlighting**: Beautiful rendering of code blocks with syntax highlighting.
-   **Streaming Responses**: Real-time typing effect for all models.
-   **Responsive Design**: Fully optimized for desktop and mobile.
-   **Aesthetic UI**: Custom "Black & Lime" neon theme for a futuristic feel.

## 🛠️ Tech Stack

-   **Frontend**: React 19, TypeScript, Vite
-   **Styling**: Tailwind CSS v4, Lucide React (Icons)
-   **State Management**: React Hooks & Local Storage
-   **API Integration**: OpenRouter API, HuggingFace API

## 📦 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/LukePamlerr/AIHeavon.git
    cd AIHeavon
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` in your browser.

## 🚀 Deployment

Deploy your own instance of AIHeavon to Vercel with a single click.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLukePamlerr%2FAIHeavon)

### Configuration

AIHeavon is a client-side application. No environment variables are strictly required for build, but users must provide their own API keys within the application settings to chat.

1.  Click the **Settings** icon in the sidebar.
2.  Enter your **OpenRouter API Key** (Get one at [openrouter.ai](https://openrouter.ai/)).
3.  (Optional) Customize the System Prompt.
4.  Start chatting!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Made with 💗 by Luke!
