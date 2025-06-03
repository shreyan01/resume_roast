# Resume Roast - AI-Powered Resume Analysis

A modern web application that helps job seekers improve their resumes through AI-powered analysis and feedback. The application features two main components:

1. **Resume Roasting**: Get brutally honest feedback on your resume from an AI that specializes in pointing out flaws and weaknesses.
2. **Premium Insights**: Access detailed ATS scoring and view resumes from MAANG company employees who graduated in the same year as you.

## Features

- 🤖 AI-powered resume roasting with witty and constructive feedback
- 📊 ATS scoring and analysis
- 🔍 Keyword optimization suggestions
- 📝 Format and structure analysis
- 👥 Access to MAANG company resumes
- 💰 Premium features for just $1

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Ollama (Open Source LLM)
- Framer Motion
- Radix UI

## Prerequisites

- Node.js 18 or later
- Ollama installed locally (for running the LLM)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/resume-roast.git
   cd resume-roast
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Ollama:
   - Follow the instructions at [https://ollama.ai](https://ollama.ai) to install Ollama
   - Pull the Mistral model:
     ```bash
     ollama pull mistral
     ```

4. Create a `.env.local` file in the root directory:
   ```
   OLLAMA_ENDPOINT=http://localhost:11434
   OLLAMA_MODEL=mistral
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Resume Roasting**:
   - Upload your resume (PDF or DOCX)
   - Get instant AI feedback on your resume
   - Engage in a conversation with the AI for more specific feedback

2. **Premium Insights**:
   - Get detailed ATS scoring
   - View keyword analysis
   - Access MAANG company resumes
   - Get improvement suggestions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
