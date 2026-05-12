const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/message', (req, res) => {
    res.json({ 
        message: 'Hello from Node.js Backend! Deployed via Jenkins CI/CD Pipeline',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/info', (req, res) => {
    res.json({
        appName: 'CI/CD Demo App',
        version: '1.0.0',
        environment: 'production'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
