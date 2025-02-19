import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// API route for currency conversion
const BASE_URL = process.env.BASE_URL;

app.get('/convert', async (req, res) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) {
            return res.status(400).json({ error: "Missing 'from' or 'to' currency" });
        }

        const url = `${BASE_URL}/${from}/${to}`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Catch-all route to serve index.html for frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
