import { cancel, confirm, intro, isCancel, outro } from "@clack/prompts";
import chalk from "chalk";
import { clearStoredToken, getStoredToken } from "../../../lib/token.js";
import { Command } from "commander";

export const logoutAction = async () => {
  intro(chalk.bold("🔓 Logout"));

  const token = await getStoredToken();

  if (!token) {
    console.log(chalk.yellow("You are not logged in."));
    process.exit(1);
  }

  const shouldLogout = await confirm({
    message: "Are you sure you want to logout?",
    initialValue: false,
  });

  if (isCancel(shouldLogout) || !shouldLogout) {
    cancel("Logout cancelled.");
    process.exit(1);
  }

  const clearToken = await clearStoredToken();

  if (clearToken) {
    outro(chalk.green("Successfully logged out."));
  } else {
    console.log(chalk.yellow("Unable to clear the token file."));
  }
};

export const logout = new Command("logout")
  .description("Logout and clear stored credentials.")
  .action(logoutAction);
