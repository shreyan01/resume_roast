import { AzureOpenAI } from "openai";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";
import "@azure/openai/types";

// Set AZURE_OPENAI_ENDPOINT to the endpoint of your
// OpenAI resource. You can find this in the Azure portal.
import "dotenv/config";

async function main() {
  console.log("== Streaming Chat Completions Sample ==");

  const scope = "https://cognitiveservices.azure.com/.default";
  const azureADTokenProvider = getBearerTokenProvider(new DefaultAzureCredential(), scope);
  const apiVersion = "2024-08-01-preview";
  const endpoint=process.env.NEXT_PUBLIC_AZURE_ENDPOINT
  const client = new AzureOpenAI({ endpoint, apiVersion, azureADTokenProvider });
  const events = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant. You will talk like a pirate." },
      { role: "user", content: "Can you help me?" },
      { role: "assistant", content: "Arrrr! Of course, me hearty! What can I do for ye?" },
      { role: "user", content: "What's the best way to train a parrot?" },
    ],
    model: "",
    max_tokens: 128,
    stream: true,
  });

  for await (const event of events) {
    for (const choice of event.choices) {
      console.log(`Chunk: ${choice.delta?.content}`);
      const filterResults = choice.content_filter_results;
      if (!filterResults) {
        continue;
      }
      if (filterResults.error) {
        console.log(
          `\tContent filter ran into an error ${filterResults.error.code}: ${filterResults.error.message}`,
        );
      } else {
        const { hate, sexual, violence } = filterResults;
        console.log(
          `\tHate category is filtered: ${hate?.filtered}, with ${hate?.severity} severity`,
        );
        console.log(
          `\tSexual category is filtered: ${sexual?.filtered}, with ${sexual?.severity} severity`,
        );
        console.log(
          `\tViolence category is filtered: ${violence?.filtered}, with ${violence?.severity} severity`,
        );
      }
    }
  }
}

main();

  // async reviewResume(resumeText: string): Promise<string> {
  //   const messages = [
  //     { role: "system", content: "You are a professional resume roaster. Provide constructive criticism and specific suggestions for improvement. Focus on formatting, content, impact statements, and professional presentation." },
  //     { role: "user", content: `Please review this resume and provide detailed feedback: \n\n${resumeText}` }
  //   ];

  //   const response = await this.client.getChatCompletions(
  //     this.deploymentId,
  //     messages,
  //     {
  //       temperature: 0.7,
  //       maxTokens: 800,
  //     }
  //   );

  //   return response.choices[0].message?.content || "Unable to generate review.";
  // }
