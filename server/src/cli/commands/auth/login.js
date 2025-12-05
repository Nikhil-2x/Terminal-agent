import { cancel, confirm, intro, isCancel, outro } from "@clack/prompts";
import { logger } from "better-auth";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import dotenv from "dotenv";

import chalk from "chalk";
import { Command } from "commander";
import fs from "fs/promises";
import os from "os";
import path from "path";
import yoctoSpinner from "yocto-spinner";
import open from "open";
import * as z from "zod";
import prisma from "../../../lib/db.js";

dotenv.config();

const URL = "http://localhost:3002";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CONFIG_DIR = path.join(os.homedir(), ".better-auth");
const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

export async function loginAction(opts) {
  const options = z.object({
    serverUrl: z.string().optional(),
    cliendtId: z.string().optional(),
  });

  const serverUrl = options.serverUrl || URL;
  const cliendtId = options.cliendtId || CLIENT_ID;

  intro(chalk.bold("🔏 Auth CLI Login"));

  const existingToken = false;
  const expired = false;

  if (existingToken && !expired) {
    const shouldReAuth = await confirm({
      message: "You are already loggedIn. Do you want to login again?",
      initialValue: false,
    });

    if (isCancel(shouldReAuth) && !shouldReAuth) {
      cancel("Login cancelled.");
      process.exit(0);
    }
  }

  const authClient = createAuthClient({
    baseURL: serverUrl,
    plugins: [deviceAuthorizationClient()],
  });

  const spinner = yoctoSpinner({ text: "Requesting device authorization..." });
  spinner.start();

  try {
    const { data, error } = await authClient.device.code({
      client_id: cliendtId,
      scope: "openid profile email",
    });

    spinner.stop();

    if (error || !data) {
      logger.error(
        `Failed to request device authorization: ${
          error.error_description || error?.message || "Unknown error"
        }`
      );

      if (error?.status === 404) {
        console.log(chalk.red("\n❌ Device authorization endpoint not found."));
        console.log(chalk.yellow("   Make sure your auth server is running."));
      } else if (error?.status === 400) {
        console.log(
          chalk.red("\n❌ Bad request - check your CLIENT_ID configuration.")
        );
      }
      process.exit(1);
    }

    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      interval = 5,
      expires_in,
    } = data;

    console.log(chalk.cyan("Device Authorization Required."));
    console.log("");

    console.log(
      `Please visit: ${chalk.underline.blue(
        verification_uri || verification_uri_complete
      )}`
    );

    console.log(`Enter code: ${chalk.bold.green(user_code)}`);
    console.log("");

    const shouldOpen = await confirm({
      message: "Open browser automatically",
      initialValue: true,
    });

    if (!isCancel(shouldOpen) && shouldOpen) {
      const urlToOpen = verification_uri || verification_uri_complete;
      await open(urlToOpen);
    }

    console.log(
      chalk.gray(
        `Waiting for authorization (expires in ${Math.floor(
          expires_in / 60
        )} minutes)...`
      )
    );
  } catch (error) {}
}

//commands
export const login = new Command("login")
  .description("Login to Logic Shell")
  .option("--server-url <url>", "The Auth server URL", URL)
  .option("--client-id <id>", "The OAuth Client ID", CLIENT_ID)
  .action(loginAction);
