const vision = require('@google-cloud/vision');
const { analyzeText } = require('../services/textAnalysisService');
const { createStructuredContent } = require('../services/structuredContentService');
const { enhanceText } = require('../services/openaiService');
const logger = require('../utils/logger');
const config = require('../config');

const client = new vision.ImageAnnotatorClient({
  keyFilename: config.googleCredentialsPath
});

const processImage = async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    logger.info('Received image buffer for processing.');

    const [result] = await client.documentTextDetection({
      image: { content: imageBuffer.toString('base64') },
    });
    logger.info('Text detection from image completed.');

    const detections = result.textAnnotations;
    const originalText = detections.length > 0 ? detections[0].description : 'No text detected';

    // Улучшение текста через OpenAI API
    const enhancedText = await enhanceText(originalText);
    logger.info('Text enhancement completed using OpenAI.');

    // Анализ улучшенного текста
    const analyzedData = analyzeText(enhancedText);
    const structuredContent = createStructuredContent(analyzedData);
    logger.info('Text analysis and structuring completed.');

    res.json({
      status: 'success',
      ocr: originalText,
      enhancedText,
      analysis: analyzedData,
      structuredContent,
    });

  } catch (error) {
    logger.error(`Error in processImage: ${error.message}`);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { processImage };
