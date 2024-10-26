const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/write-url', (req, res) => {
    const { url } = req.body;
    console.log('Received URL:', url);

    fs.writeFileSync('.env', `STORED_URL=${url}\n`, { flag: 'a' });

    fs.appendFileSync('url.txt', `${url}\n`);

    require('dotenv').config();

    console.log('Stored URL:', process.env.STORED_URL);
    res.sendStatus(200);
});

app.get('/stored-url', (req, res) => {
    res.json({ storedUrl: process.env.STORED_URL || 'No URL stored' });
});

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
