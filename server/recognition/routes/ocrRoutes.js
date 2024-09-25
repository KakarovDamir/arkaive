const express = require('express');
const multer = require('multer');
const { processImage } = require('../controllers/ocrController');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), processImage);

module.exports = router;