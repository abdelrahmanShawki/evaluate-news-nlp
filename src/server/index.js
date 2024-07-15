const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch'); // Ensure node-fetch is installed
const FormData = require('form-data'); // Ensure form-data is installed

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Serve static files from the "dist" directory
app.use(express.static('dist'));

// Handle the root route
app.get('/', (req, res) => {
    res.sendFile(path.resolve('dist/index.html'));
});

// API call route
app.post('/api', async (req, res) => {
    const { text } = req.body;
    const apiKey = process.env.API_KEY;
    const apiURL = process.env.API_URL;

    try {
        const formdata = new FormData();
        formdata.append("key", apiKey);
        formdata.append("txt", text);
        formdata.append("lang", "en"); // Use the appropriate language code

        const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        const response = await fetch(apiURL, requestOptions); // use await to handle promise
        const data = await response.json(); // properly handle JSON parsing with await

        console.log("Status:", response.status, "Body:", data);
        res.send(data); // send the parsed data back to the client
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Failed to fetch data from API' });
    }
});
