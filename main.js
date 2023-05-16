const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
const port = 4040;

const accountSid = "AC579193785052afd8db967f50062c5bed";
const authToken = "a3d05c67d4c195fde8098ce81797b022";
const twilioNumber = "whatsapp:+14155238886";
const OPENAI_API_KEY = "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";

const client = new twilio(accountSid, authToken);
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
app.post("/", bodyParser.urlencoded({ extended: false }), (req, res) => {
  res.json({
    message: "test is working",
  });
});
app.post(
  "/incoming",
  bodyParser.urlencoded({ extended: false }),

  (req, res) => {
    console.log(req.body);
    const message = req.body.Body;
    const from = req.body.From;
    console.log(`Received message "${message}" from ${from}`);
    const accountSid = "AC633f733535cff831b7b2fbfa7edcbe49";
    const authToken = "c8662cfd5aa01216b091807b0f8f2417";
    const client = new twilio(accountSid, authToken);
    openai
      .createCompletion({
        prompt: `"${message}"`,
        model: "text-davinci-002",
        max_tokens: 100,
        temperature: 0.5,
      })
      .then((response) => {
        const responseText = response.data.choices[0].text;
        console.log(responseText);
        client.messages
          .create({
            body: responseText,
            from: "whatsapp:+14155238886",
            to: from,
          })
          .then((message) => console.log(`Sent message: ${message.sid}`))
          .done();
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

app.post("/send-sms", bodyParser.json({ extended: false }), (req, res) => {
  const to = req.body.to;
  const message = req.body.message;

  const accountSid = "AC633f733535cff831b7b2fbfa7edcbe49";
  const authToken = "c8662cfd5aa01216b091807b0f8f2417";
  const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      body: message,
      from: "whatsapp:+14155238886",
      to: "whatsapp:".concat(to),
    })
    .then((message) => res.send(message))
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: "Error occurred while sending message" });
    })
    .done();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
