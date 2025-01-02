import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku about ai"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));