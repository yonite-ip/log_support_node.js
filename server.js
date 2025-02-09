const express = require("express");
const fs = require("fs");
const readline = require("readline");
const cors = require("cors");

const app = express();
const LOG_FILE = "C:\\Users\\Yoni\\Desktop\\canva_dashboard\\test.txt";


app.use(cors());
app.use(express.json());

// Function to extract `call_id` based on phone number
async function getLastCallId(dialedNumber) {
  if (!fs.existsSync(LOG_FILE)) return null;
  
  let lastCallId = null;
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(LOG_FILE, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.includes(dialedNumber)) {
        const match = line.match(/([a-f0-9-]{36})/i);
        if (match) lastCallId = match[1];
      }
    }
  } catch (err) {
    console.error("Error reading logs:", err);
  }
  return lastCallId;
}

// Process a single log line to determine call routing events
function processCallFlowLine(line, callFlow) {
  const destinationMatch = line.match(/Transfer .*? to XML\[(\d+)@/);
  if (destinationMatch) {
    const destination = parseInt(destinationMatch[1], 10);
    let eventDescription = "Call Routed";

    if (destination >= 800 && destination <= 899) {
      eventDescription = "Time Condition Applied";
    } else if (destination >= 400 && destination <= 499) {
      eventDescription = "Call Sent to Ring Group";
    } else if (destination >= 200 && destination <= 399) {
      eventDescription = "Call Routed to an Extension";
    } else if (destination >= 600 && destination <= 699) {
      eventDescription = "Call Passed Through an IVR";
    }

    callFlow.push({ event: eventDescription, destination, log: line.trim() });
  }
}

// Extract call flow details using `call_id`
async function parseCallFlow(callId, dialedNumber) {
  const callFlow = [];
  if (!fs.existsSync(LOG_FILE)) return callFlow;

  const seenLogs = new Set();

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(LOG_FILE, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.includes(callId) && !seenLogs.has(line)) {
        seenLogs.add(line);
        processCallFlowLine(line, callFlow);
      }
    }
  } catch (err) {
    console.error("Error parsing call flow:", err);
  }

  return callFlow;
}

// API to analyze call flow
app.post("/api/analyze", async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: "Phone number is required" });

  const callId = await getLastCallId(phoneNumber);
  if (!callId) return res.status(404).json({ error: "No call flow found for this number" });

  const callFlowData = await parseCallFlow(callId, phoneNumber);
  res.json({ callId, callFlow: callFlowData });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
