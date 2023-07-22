const express = require("express");
const app = express();
const port = 80;

const { updatingCustomFieldValue } = require("./scripts.js");
let id;
// Middleware to parse request body as JSON
app.use(express.json());

// Route to handle PUT request
app.put("/update-pipedrive", (req, res) => {
  const formData = req.body; // Assuming data is sent as JSON
  updatingCustomFieldValue(formData, id);
  res.json({ success: true, message: "Data received successfully." });
});
app.use((req, res, next) => {
  id = req.query.selectedIds;
  next();
});
// Serve the index.html file for other requests

app.use(express.static("public"));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
