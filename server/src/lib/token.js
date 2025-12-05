import chalk from "chalk";
import { CONFIG_DIR, TOKEN_FILE } from "../cli/commands/auth/login.js";
import fs from "fs/promises";
import { logger } from "better-auth";

export async function getStoredToken() {
  try {
    const data = await fs.readFile(TOKEN_FILE, "utf-8");
    const token = JSON.parse(data);
    console.log(token);

    return token;
  } catch (error) {
    // console.log(
    //   chalk.red("file doesn't exist or can't be read."),
    //   error.message
    // );

    return null;
  }
}

export async function storeToken(token) {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });

    const tokenData = {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      token_type: token.token_type || "Bearer",
      scope: token.scope,
      expires_at: token.expires_in
        ? new Date(Date.now() + token.expires_in * 1000).toISOString()
        : null,
      created_at: new Date().toISOString(),
    };

    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokenData, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.log(chalk.red("Failed to store the token :", error.message));
    return false;
  }
}

export async function clearStoredToken() {
  try {
    await fs.unlink(TOKEN_FILE);
    return true;
  } catch (error) {
    console.log(
      chalk.red(
        "File doesn't exist or got error while deleting..",
        error.message
      )
    );
    return false;
  }
}

export async function isTokenExpired() {
  try {
    const token = await getStoredToken();

    if (!token) {
      logger?.info?.("No stored token found.");
      return true;
    }

    if (!token.expires_at) {
      logger?.warn?.("Token has no expires_at field.");
      return true;
    }

    const expiresAt = new Date(token.expires_at);

    if (isNaN(expiresAt.getTime())) {
      logger?.error?.("Invalid expires_at date format in token.");
      return true;
    }

    const now = new Date();
    const timeDifference = expiresAt.getTime() - now.getTime();

    const buffer = 5 * 60 * 1000;

    if (timeDifference <= buffer) {
      logger?.info?.("Token is expired or about to expire.");
      return true;
    }

    return false;
  } catch (error) {
    logger?.error?.("Error checking token expiration:", error);
    return true;
  }
}

export async function requireAuth() {
  try {
    const token = await getStoredToken();

    // No token = not logged in
    if (!token) {
      console.log("");
      console.log(chalk.red("❌ You are not authenticated."));
      console.log(
        chalk.gray("   Run ") +
          chalk.cyan.bold("logicsh login") +
          chalk.gray(" to continue.\n")
      );
      process.exit(1);
    }

    // Token exists but possibly expired
    const expired = await isTokenExpired();

    if (expired) {
      console.log("");
      console.log(chalk.yellow("⚠️  Your session has expired."));
      console.log(
        chalk.gray("   Please run ") +
          chalk.cyan.bold("logicsh login") +
          chalk.gray(" to re-authenticate.\n")
      );
      process.exit(1);
    }

    // Fully authenticated
    return token;
  } catch (err) {
    logger?.error?.("Error in requireAuth:", err);

    console.log(chalk.red("❌ Authentication check failed unexpectedly."));
    console.log(
      chalk.gray("   Try running ") +
        chalk.cyan.bold("logicsh login") +
        chalk.gray(" again.\n")
    );

    process.exit(1);
  }
}
