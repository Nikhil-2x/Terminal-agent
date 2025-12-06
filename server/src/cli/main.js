#!/usr/bin/env node

import figlet from "figlet";
import chalk from "chalk";
import { Command } from "commander";

import "dotenv/config";
import { login } from "./commands/auth/login.js";
import { logout } from "./commands/auth/logout.js";
import { whoami } from "./commands/auth/whoami.js";

async function main() {
  console.log(
    chalk.cyan(
      figlet.textSync("Logic  Shell", {
        font: "doom",
        horizontalLayout: "fitted",
      }),
    ),
  );

  console.log(chalk.grey("A terminal based ai tool"));

  const program = new Command("logicsh");
  program
    .version("0.1")
    .description("Logic Shell - A cli based AI Tool")
    .addCommand(login)
    .addCommand(logout)
    .addCommand(whoami);

  program.action(() => {
    program.help();
  });

  program.parse();
}

main().catch((err) => {
  console.log(chalk.red("Error running Logic-Shell:", err));
  process.exit(1);
});
