import chalk from "chalk";
import { Command } from "commander";
import yoctoSpinner from "yocto-spinner";
import { getStoredToken } from "../../../lib/token.js";
import { select } from "@clack/prompts";
import prisma from "../../../lib/db.js";
import { startChat } from "../../chat/chat-with-ai.js";
import { startToolChat } from "../../chat/chat-with-ai-tools.js";

const wakeupAction = async () => {
  const token = await getStoredToken();

  if (!token?.access_token) {
    console.log(chalk.red("Not authenticated. Please login first."));
    return;
  }

  const spinner = yoctoSpinner({ text: "Fetching user information... " });
  spinner.start();

  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: {
          token: token.access_token,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  spinner.stop();

  if (!user) {
    console.log(chalk.red("User not found..."));
    return;
  }

  console.log(chalk.green(`Welcome back ${user.name}.\n`));

  const choice = await select({
    message: "Choose an option:",
    options: [
      {
        value: "chat",
        label: "Chat",
        hint: "Chat with an AI",
      },
      {
        value: "tool",
        label: "Tool Calling",
        hint: "Chat with tools (Google search, code execution)",
      },
      {
        value: "agent",
        label: "Agentic mode",
        hint: "Advanced ai agent ",
      },
    ],
  });

  switch (choice) {
    case "chat":
      console.log(chalk.green("chat selected"));
      startChat("chat");
      break;

    case "tool":
      console.log(chalk.green("Tool selected"));
      startToolChat();
      break;

    case "agent":
      console.log(chalk.green("Agent selected"));
      break;
  }
};

export const wakeUp = new Command("wakeup")
  .description("Wakeup the ai features")
  .action(wakeupAction);
