const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const outputDir = './output';
const envFilePath = `${outputDir}/.env`;
const dataFilePath = path.join(outputDir, 'data.json');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const outputSentimentPath = path.join(__dirname, 'output', 'sentiment.txt');

const runAudioToSentiment = () => {
    return new Promise((resolve, reject) => {
        exec('python audio_to_sentiment.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Script stderr: ${stderr}`);
                return reject(new Error(stderr));
            }
            console.log(`Script output: ${stdout}`);
            resolve(stdout.trim());
        });
    });
};

const readSentimentFromFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(outputSentimentPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading sentiment file:', err);
                return reject(err);
            }

            const sentimentOutput = parseFloat(data.trim());
            if (isNaN(sentimentOutput)) {
                return reject(new Error('Invalid output from sentiment file'));
            }
            resolve(sentimentOutput);
        });
    });
};


app.post('/write-data', async (req, res) => {
    const { companyName, qxYear, sentimentPercent } = req.body;

    // Basic validation
    if (!companyName || !qxYear || typeof sentimentPercent !== 'number') {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    // Prepare data to be written
    const dataToStore = {
        companyName,
        qxYear,
        sentimentPercent,
        timestamp: new Date(),
    };

    // Read the existing data
    fs.readFile(dataFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        let jsonData = [];
        if (data) {
            try {
                jsonData = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        // Add the new entry
        jsonData.push(dataToStore);

        // Write back to the file
        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf8', async (writeErr) => {
            if (writeErr) {
                console.error('Error writing data to file:', writeErr);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Check if MODELRUNNING is true
            let sentimentOutput = null;
            if (process.env.MODELRUNNING === 'true') {
                try {
                    // Execute the script to get the sentiment value
                    sentimentOutput = await runAudioToSentiment();
                } catch (err) {
                    console.error('Error running sentiment analysis:', err);
                    return res.status(500).json({ error: 'Error running sentiment analysis' });
                }
            }

            // Read the sentiment value from the file
            let fileSentimentOutput = null;
            try {
                fileSentimentOutput = await readSentimentFromFile();
            } catch (err) {
                console.error('Error reading sentiment from file:', err);
                return res.status(500).json({ error: 'Error reading sentiment from file' });
            }

            // Normalize both outputs
            const normalizedScriptSentiment = (parseFloat(sentimentOutput) + 1) / 2;
            const normalizedFileSentiment = (fileSentimentOutput + 1) / 2;

            // Use either output as needed (you can choose which one to send)
            res.status(200).json({
                message: 'Data submitted successfully',
                sentimentPercent: normalizedFileSentiment // Use normalizedFileSentiment or normalizedScriptSentiment
            });
        });
    });
});

app.post('/set-model-running', (req, res) => {
    const { modelRunning } = req.body;

    if (typeof modelRunning !== 'boolean') {
        return res.status(400).json({ error: 'Invalid model running status.' });
    }

    try {
        fs.writeFileSync(envFilePath, `MODELRUNNING=${modelRunning}\n`, { flag: 'w' });
        res.json({ message: `Model running state set to ${modelRunning}` });
    } catch (err) {
        console.error('Error writing model running state to file:', err);
        res.status(500).json({ error: 'Error writing model running state to file' });
    }
});

app.get('/companies', (req, res) => {
    const dataFilePath = `${outputDir}/data.json`;
    
    if (fs.existsSync(dataFilePath)) {
        const jsonData = fs.readFileSync(dataFilePath);
        const existingData = JSON.parse(jsonData);
        
        // Extract unique company names
        const companies = [...new Set(existingData.map(entry => entry.companyName))];
        res.json(companies);
    } else {
        res.json([]);
    }
});

app.get('/sentiment', (req, res) => {
    fs.readFile(outputSentimentPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading sentiment file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const sentimentOutput = parseFloat(data.trim());
        if (isNaN(sentimentOutput)) {
            return res.status(500).json({ error: 'Invalid output from sentiment file' });
        }

        // Normalize the sentiment value to [0, 1]
        const normalizedSentiment = (sentimentOutput + 1) / 2;
        res.json(normalizedSentiment);
    });
});

app.get('/data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'output', 'data.json')); // Adjust the path as needed
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});