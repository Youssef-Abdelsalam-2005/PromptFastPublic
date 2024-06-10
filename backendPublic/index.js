const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./promptfast-ccf28-firebase-adminsdk-2629j-6b20ae7967.json");
const getBilling = require("./get-billing");

const app = express();

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Import the function from the ES module file
import("./generate-prompt.mjs")
  .then(({ default: generatePrompt }) => {
    app.post("/generate-prompt", generatePrompt);
    app.post("/get-billing", getBilling);

    app.listen(3001, () => console.log("Listening on port 3001"));
  })
  .catch((error) => {
    console.error("Error importing generatePrompt:", error);
  });
