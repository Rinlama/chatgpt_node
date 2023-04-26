require("dotenv").config();
const express = require("express");
const app = express();
//onst router = require("./routes/route");

const cors = require("cors");
// route

var corsOptions = {
  origin: "http://127.0.0.1:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors());
// open ai
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("client/build"));

//app.use(router);

app.post("/api/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      res.status(404).send(`Prompt not found`);
    }
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt,
      max_tokens: 200,
    });
    res.send(completion.data.choices[0].text);
  } catch (ex) {
    res.send(ex);
  }
});

app.listen(3001, () => {
  console.log("Server is running " + 3001);
});
