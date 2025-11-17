// Exemplo de código de SERVIDOR (Node.js com Express)
// VOCÊ PRECISA DE UM SERVIDOR PARA EXECUTAR ESTE CÓDIGO
import { GoogleGenAI } from '@google/genai';
import express from 'express';
import cors from 'cors'; // Para permitir requisições do seu frontend

const app = express();
const PORT = 5500;

// Inicializa o cliente da API Gemini
// A chave é lida da variável de ambiente GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors()); // Configurações de segurança
app.use(express.json()); // Habilita o uso de JSON no corpo da requisição

app.post('/api/generate-image', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'O campo prompt é obrigatório.' });
    }

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002', // Modelo de geração de imagens
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                // Opcional: Especifique a proporção
                aspectRatio: '1:1',
            },
        });

        // A API Gemini retorna os dados da imagem em Base64 (image_bytes)
        const base64Image = response.generatedImages[0].image.imageBytes;
        
        // Envia a imagem em Base64 de volta para o frontend
        // O frontend usará isso para exibir a imagem
        res.json({ base64Image: base64Image });

    } catch (error) {
        console.error('Erro ao gerar imagem com Imagen:', error);
        res.status(500).json({ error: 'Erro interno ao gerar a imagem.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});