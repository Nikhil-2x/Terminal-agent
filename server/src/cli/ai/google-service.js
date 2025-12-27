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

  async sendMessage(messages, onChunk, tools = {}, onToolCall = null) {
    try {
      const streamConfig = {
        model: this.model,
        messages: messages,
      };

      if (tools && Object.keys(tools).length > 0) {
        streamConfig.tools = tools;
        streamConfig.maxSteps = 5;
      }
      // console.log(
      //   chalk.gray(`[DEBUG] Tools enabled: ${Object.keys(tools).join(", ")}`)
      // );
      console.log(
        chalk.gray(
          `[DEBUG] Tools enabled: ${
            Object.keys(tools).length > 0
              ? Object.keys(tools).join(", ")
              : "none"
          }`
        )
      );

      const result = streamText(streamConfig);

      let fullResponse = "";

      for await (const chunk of result.textStream) {
        fullResponse += chunk;
        if (onChunk) {
          onChunk(chunk);
        }
      }
      const fullResult = result;

      const toolCalls = [];
      const toolResults = [];

      if (fullResult.steps && Array.isArray(fullResult.steps)) {
        for (const step of fullResult.steps) {
          if (step.toolCalls && step.toolCalls.length > 0) {
            for (const toolCall of step.toolCalls) {
              toolCalls.push(toolCall);

              if (onToolCall) {
                onToolCall(toolCalls);
              }
            }
          }

          if (step.toolResults && step.toolResults.length > 0) {
            toolResults.push(...step.toolResults);
          }
        }
      }

      return {
        content: fullResponse,
        finishResponse: fullResult.finishReason,
        usage: fullResult.usage,
        toolCalls,
        toolResults,
        steps: fullResult.steps,
      };
    } catch (err) {
      console.error(chalk.red("Ai service error:"), err.message);
      throw err;
    }
  }

  async getMessage(messages, tools = undefined) {
    let fullResponse = "";
    const result = await this.sendMessage(
      messages,
      (chunk) => {
        fullResponse += chunk;
      },
      tools
    );
    1;

    return result.content;
  }
}
