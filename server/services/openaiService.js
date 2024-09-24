const { OpenAI } = require('openai');
const logger = require('../utils/logger');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

const enhanceText = async (text) => {
  const systemPrompt = 
  `Ты - эксперт в обработке текста. 
  Ты можешь улучшать текст, исправляя ошибки и дополняя его по контексту. 
  Ты также можешь добавлять контекст, если это необходимо. 
  Ты должен быть очень точным и аккуратным.
  Оправляй только текст, без каких-либо комментариев.
  `;

  const userPrompt = `Улучши текст: ${text}`;
  
  try {
    const completion = openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 2048,
    });

    // console.log((await completion).choices[0].message.content);
    let res = (await completion).choices[0].message.content;
    logger.info('Text enhancement completed with OpenAI.');
    return res;
  } catch (error) {
    logger.error(`Error in enhanceText: ${error.message}`);
    throw new Error('Failed to enhance text with OpenAI.');
  }
};

module.exports = { enhanceText };
