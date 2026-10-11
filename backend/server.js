const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("GROQ_API_KEY manquante dans le fichier .env");
    return res.status(500).json({ content: "Je n'ai pas pu répondre. (Clé API manquante côté serveur)" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", // ancien modèle "llama3-8b-8192" retiré par Groq
        messages: [
          { role: "system", content: "Tu es un assistant pour ElectroManager. Réponds en français." },
          { role: "user", content: message }
        ],
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur renvoyée par Groq:", data);
      return res.status(500).json({ content: "Je n'ai pas pu répondre. (Erreur API Groq, voir logs serveur)" });
    }

    const content = data.choices[0].message.content;
    res.json({ content });

  } catch (err) {
    console.error("Erreur lors de l'appel à Groq:", err);
    res.status(500).json({ content: "Je n'ai pas pu répondre. (Erreur serveur, voir logs)" });
  }
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend ElectroManager fonctionne!' });
});

app.listen(PORT, () => {
  console.log(`Backend ElectroManager démarré sur http://localhost:${PORT}`);
});