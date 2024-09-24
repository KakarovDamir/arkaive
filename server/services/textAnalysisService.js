const nlp = require('compromise');
const logger = require('../utils/logger');

const extractDates = (text) => {
  const dateRegex = /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\b\d{4}\b)\b/g;
  return text.match(dateRegex) || [];
};

const analyzeText = (text) => {
  try {
    const doc = nlp(text);

    const names = doc.people().out('array');
    const dates = extractDates(text); // Use regex or another method to extract dates
    const places = doc.places().out('array');

    logger.info('Text analysis completed using compromise.');
    return {
      attributes: {
        names,
        dates,
        places
      }
    };
  } catch (error) {
    logger.error(`Error in analyzeText: ${error.message}`);
    throw new Error('Failed to analyze text.');
  }
};

module.exports = { analyzeText };
