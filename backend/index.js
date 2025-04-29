import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// API endpoint for code generation
app.post('/api/generate-code', async (req, res) => {
  try {
    const { prompt, language } = req.body;
    if (!prompt || !language) {
      return res.status(400).json({ error: 'Prompt and language are required' });
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `You are an expert programmer. Generate ${language} code based on the user's prompt.` },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const generatedCode = completion.data.choices[0].message.content;
    res.json({ code: generatedCode });
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

// API endpoint for chatbot assistance
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful coding assistant chatbot.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const chatbotResponse = completion.data.choices[0].message.content;
    res.json({ response: chatbotResponse });
  } catch (error) {
    console.error('Error in chatbot:', error);
    res.status(500).json({ error: 'Failed to get chatbot response' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
