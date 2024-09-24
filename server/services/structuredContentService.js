const logger = require('../utils/logger');

const createStructuredContent = (analyzedData) => {
  try {
    const { attributes } = analyzedData;
    logger.info('Creating structured content.');

    return {
      summary: `Найдено ${attributes.names.length} имен, ${attributes.dates.length} дат, и ${attributes.places.length} мест.`,
      details: {
        names: attributes.names,
        dates: attributes.dates,
        places: attributes.places
      }
    };
  } catch (error) {
    logger.error(`Error in createStructuredContent: ${error.message}`);
    throw new Error('Failed to create structured content.');
  }
};

module.exports = { createStructuredContent };
