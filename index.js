const OpenAI = require("openai");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();

const options = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI(options);

async function main(content) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `${content}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0].message.content;

  for (let i = 0; i < 5; i++) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `generate followup questions for this: ${content}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    console.log(
      `Suggestion ${i}: `,
      completion.choices[0].message.content,
      "\n",
    );
  }
  console.log("Enjoy your day!");
}

const app = express();
const PORT = 4000;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/chat", async (req, res) => {
  const followup = [];
  const { prompt } = req.body;
  console.log(req.body);
  const fifth = await main(prompt);
  for (let i = 0; i < 5; i++) {
    const flint = await main(
      `generate just one followup question for this: ${prompt}`,
    );
    const answer = {
      question: flint,
    };
    followup.push(answer);
  }

  const response = {
    response: fifth,
    follow_up_questions: followup,
  };
  res.json(response).status(200);
});

app.listen(PORT, () => console.log(`Server Started on port: ${PORT}`));
