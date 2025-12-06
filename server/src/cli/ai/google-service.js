import { google } from "@ai-sdk/google";
import { config } from "../../config/google.config.js";
import { streamText } from "ai";
import chalk from "chalk";

export class AIService {
  constructor() {
    if (!config.googleApiKey) {
      throw new Error("Google api key is not set in env");
    }

    this.model = google(config.model, { apiKey: config.googleApiKey });
  }

  async sendMessage(messages, onChunk, tools = undefined, onToolCall = null) {
    try {
      const streamConfig = {
        mode: this.model,
        messages: messages,
      };

      const result = streamText(streamConfig);

      let fullResponse = "";

      for await (const chunk of result.textStream) {
        fullResponse += chunk;
        if (onChunk) {
          onChunk(chunk);
        }
      }
      const fullResult = result;

      return {
        content: fullResponse,
        finishResponse: fullResult.finishReason,
        usage: fullResponse.usage,
      };
    } catch (err) {
      console.error(chalk.red("Ai service error:"), err.message);
      throw err;
    }
  }

  async getMessage(messages, tools = undefined) {
    let fullResponse = "";
    await this.sendMessage(messages, (chunk) => {
      fullResponse += chunk;
    });

    return fullResponse;
  }
}
