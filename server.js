const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const { run } = require('./back'); // Import the run function from back.js
const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/ai', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const result = await run(prompt);
    res.json({ response: result });
  } catch (error) {
    res.status(500).send('Error processing request');
  }
});

app.listen(port, (error) => {
  if (error) {
    console.log('Something went wrong', error);
  } else {
    console.log('Server is listening on port ' + port);
  }
});


