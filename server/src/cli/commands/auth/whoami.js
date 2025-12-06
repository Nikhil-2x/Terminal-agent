import chalk from "chalk";
import prisma from "../../../lib/db.js";
import { requireAuth } from "../../../lib/token.js";
import { Command } from "commander";

export const whoamiAction = async (opts) => {
  const URL = "http://localhost:3002";

  const token = await requireAuth();

  if (!token?.access_token) {
    console.log("No access token found. Please login.");
    process.exit(1);
  }

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

  console.log(
    chalk.bold.greenBright(`\n ✌︎㋡ User: ${user.name}
    📧 Email:${user.email}
    🆔 ID: ${user.id}
    `),
  );
};

export const whoami = new Command("whoami")
  .description("Shows details of current authenticated user.")
  .option("--server-url <url>", "The Better Auth server URL", URL)
  .action(whoamiAction);
