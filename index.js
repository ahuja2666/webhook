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
// Issue related events
// JQL: project = "testing project" AND issuekey in (issueid-1, issueid-2, issueid-3)
// Issueupdated
// whenver these issues will update this webhook will trigger and send the sampleWebookResponse.json
// we can find the status chnage in changelog.items
app.post('/jira-webhook', (req, res) => {
  // Log the entire request body to the console
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));

  // Send a response back to Jira to acknowledge receipt
  res.status(200).send('Webhook received');
});

app.post('/update-jira-status', async (req, res) => {
  // Log the entire request body to the console
  const { issueId, status } = req.body
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic YWh1amFoYXJzaGl0MjZAZ21haWwuY29tOkFUQVRUM3hGZkdGMGJuTzBQdnlsM25uZVp6SUhHNk90bXU1SU9jSkJYaGFBSmRUa0x5X0kycmpHZFVlV1FxM01iLWxuOGpldFprRHA4V0N0T1MzLVFBUUlnOGlFRHd2ak9NTnQxNE4wNEFMbHFfV2I4OVNUMG9aSGdKVVVvTEpTN0lhYzQ5aUY0b0tOc0tqNjBVZVRIS0VzMkNqZGh0QXBQVklvZDh2NHBMRFdDVnJWT2JsMEhXST00RTdGMDkxQg==");
    myHeaders.append("Cookie", "atlassian.xsrf.token=e64663efb091603e61d3c94f45ceb2df375b2ea9_lin");

    const raw = JSON.stringify({
      "transition": {
        "id": status
      }
    });
    const data = await fetch(`https://ahujaharshit26.atlassian.net/rest/api/2/issue/${issueId}/transitions`,
      {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      }
    )
    if (data.status == 204) {
      res.status(200).json({
        status: true,
        message: "status updated successfully"
      })
    } else {
      throw new Error("unable to update")
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message || "something went wrong"
    })
  }

});

app.post('/add-comment', async (req, res) => {
  // Log the entire request body to the console
  const { issueId, comment } = req.body
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic YWh1amFoYXJzaGl0MjZAZ21haWwuY29tOkFUQVRUM3hGZkdGMGJuTzBQdnlsM25uZVp6SUhHNk90bXU1SU9jSkJYaGFBSmRUa0x5X0kycmpHZFVlV1FxM01iLWxuOGpldFprRHA4V0N0T1MzLVFBUUlnOGlFRHd2ak9NTnQxNE4wNEFMbHFfV2I4OVNUMG9aSGdKVVVvTEpTN0lhYzQ5aUY0b0tOc0tqNjBVZVRIS0VzMkNqZGh0QXBQVklvZDh2NHBMRFdDVnJWT2JsMEhXST00RTdGMDkxQg==");

    const bodyData = JSON.stringify({
      body: {
        content: [
          {
            content: [
              {
                text: comment,
                type: "text"
              }
            ],
            type: "paragraph"
          }
        ],
        type: "doc",
        version: 1
      }
    })
    console.log(bodyData)

    const data = await fetch(`https://ahujaharshit26.atlassian.net/rest/api/3/issue/${issueId}/comment`, {
      method: 'POST',
      headers: myHeaders,
      body: bodyData
    })
    if (data.status == 201) {
      res.status(200).json({
        status: true,
        message: "comment added successfully"
      })
    } else {
      console.log(data)
      throw new Error("unable to add comment")
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message || "something went wrong"
    })
  }

});

app.get("/", (req, res) => {
  res.send("server is up")
})

// Start the server on port 8080
app.listen(PORT, () => {
  console.log('Server is running on port 8080');
});
