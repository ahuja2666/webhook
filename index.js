// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express application
const app = express();

const PORT = process.env.PORT || 8080

app.use(cors());

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define the webhook endpoint
app.post('/jira-webhook', (req, res) => {
  // Log the entire request body to the console
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));

  // Send a response back to Jira to acknowledge receipt
  res.status(200).send('Webhook received');
});

app.get("/", (req, res) => {
  res.send("server is up")
})

// Start the server on port 3000
app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
