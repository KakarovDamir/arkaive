const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  googleCredentialsPath: path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS),
  openAIApiKey: process.env.OPENAI_API_KEY
};
