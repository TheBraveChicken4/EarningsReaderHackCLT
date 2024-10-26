const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const outputDir = './output'; // Point to the output directory in the backend folder
const urlFilePath = `${outputDir}/url.txt`;
const envFilePath = `${outputDir}/.env`;

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

app.post('/write-url', (req, res) => {
    const { url } = req.body;
    console.log('Received URL:', url);

    // Read existing URLs from output/url.txt
    const existingUrls = fs.existsSync(urlFilePath) 
        ? fs.readFileSync(urlFilePath, 'utf-8').split('\n').map(line => line.trim()) 
        : [];

    if (existingUrls.includes(url)) {
        return res.status(400).json({ error: 'This URL has already been submitted.' });
    }

    // Write URL to .env file and output/url.txt
    try {
        fs.writeFileSync(envFilePath, `STORED_URL=${url}\n`, { flag: 'w' });
        fs.appendFileSync(urlFilePath, `${url}\n`);
    } catch (err) {
        console.error('Error writing URL to file:', err);
        return res.status(500).json({ error: 'Error writing URL to file' });
    }

    // Call the Python script to get text data
    exec(`python retrieve_text.py`, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${stderr}`);
            return res.status(500).json({ error: 'Error retrieving text data' });
        }

        console.log('Python script output:', stdout);
        
        res.json({ message: 'URL stored successfully', textLength: stdout.trim() });
    });
});

app.post('/set-recording-running', (req, res) => {
    const { recordingRunning } = req.body;

    if (typeof recordingRunning !== 'boolean') {
        return res.status(400).json({ error: 'Invalid recording running status.' });
    }

    // Read existing env variables
    const currentUrl = process.env.STORED_URL || '';
    const currentModelRunning = process.env.MODELRUNNING || 'false';

    // Write the new state
    try {
        fs.writeFileSync(envFilePath, `STORED_URL=${currentUrl}\nRECORDINGRUNNING=${recordingRunning}\nMODELRUNNING=${currentModelRunning}\n`, { flag: 'w' });
        res.json({ message: `Recording running state set to ${recordingRunning}` });
    } catch (err) {
        console.error('Error writing recording running state to file:', err);
        res.status(500).json({ error: 'Error writing recording running state to file' });
    }
});

app.post('/set-model-running', (req, res) => {
    const { modelRunning } = req.body;

    if (typeof modelRunning !== 'boolean') {
        return res.status(400).json({ error: 'Invalid model running status.' });
    }

    // Read existing env variables
    const currentUrl = process.env.STORED_URL || '';
    const currentRecordingRunning = process.env.RECORDINGRUNNING || 'false';

    // Write the new state
    try {
        fs.writeFileSync(envFilePath, `STORED_URL=${currentUrl}\nRECORDINGRUNNING=${currentRecordingRunning}\nMODELRUNNING=${modelRunning}\n`, { flag: 'w' });
        res.json({ message: `Model running state set to ${modelRunning}` });
    } catch (err) {
        console.error('Error writing model running state to file:', err);
        res.status(500).json({ error: 'Error writing model running state to file' });
    }
});

app.get('/stored-url', (req, res) => {
    res.json({ storedUrl: process.env.STORED_URL || 'No URL stored' });
});

app.get('/sentiment', (req, res) => {
    res.json({
        //Using fixed numbers as a placeholder
        positive: process.env.POSITIVE || 0.04,
        negative: process.env.NEGATIVE || 0.16,
        neutral: process.env.NEUTRAL || 0.8,
    });
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});