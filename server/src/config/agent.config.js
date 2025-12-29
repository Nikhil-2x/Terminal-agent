import { generateObject } from "ai";
import chalk from "chalk";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

const ApplicationSchema = z.object({
  folderName: z
    .string()
    .describe("Kebab-case folder name for the application."),
  description: z.string().describe("Brief description of what was created."),
  files: z.array(
    z
      .object({
        path: z.string().describe("Relative file path e.g.(src/App.jsx)"),
        content: z.string().describe("Complete file content"),
      })
      .describe("All fikes needed for application"),
  ),

  setupCommands: z.array(
    z
      .string()
      .describe(
        "Bash command to setup and run (e.g. npm install, npm run dev)",
      ),
  ),
  dependencies: z
    .array(
      z.object({
        name: z.string().describe("npm package name"),
        version: z.string().describe("npm package version"),
      }),
    )
    .optional()
    .describe("npm dependencies"),
});

function printSystem(message) {
  console.log(message);
}

function displayFileTree(files, folderName) {
  printSystem(chalk.cyan("\n📂 Project Structure:"));
  printSystem(chalk.white(`${folderName}/`));

  const filesByDir = {};
  files.forEach((file) => {
    const parts = file.path.split("/");
    const dir = parts.length > 1 ? parts.slice(0, -1).join("/") : "";

    if (!filesByDir[dir]) {
      filesByDir[dir] = [];
    }
    filesByDir[dir].push(parts[parts.length - 1]);
  });

  Object.keys(filesByDir)
    .sort()
    .forEach((dir) => {
      if (dir) {
        printSystem(chalk.white(`├── ${dir}/`));
        filesByDir[dir].forEach((file) => {
          printSystem(chalk.white(`│   └── ${file}`));
        });
      } else {
        filesByDir[dir].forEach((file) => {
          printSystem(chalk.white(`├── ${file}`));
        });
      }
    });
}

async function createApplicationFiles(baseDir, folderName, files) {
  const applicationDir = path.join(baseDir, folderName);

  await fs.mkdir(applicationDir, { recursive: true });
  printSystem(chalk.cyan(`Created Directory: ${folderName}/`));

  for (const file of files) {
    const filePath = path.join(applicationDir, file.path);
    const fileDir = path.dirname(filePath);

    await fs.mkdir(fileDir, { recursive: true });
    await fs.writeFile(filePath, file.content, "utf-8");
    printSystem(chalk.green(`✔️${file.path}`));
  }

  return applicationDir;
}

export async function generateApplication(
  description,
  aiService,
  cwd = process.cwd(),
) {
  try {
    printSystem(chalk.cyan("\n🤖 Agent Mode: ⌛Generating your application"));
    printSystem(chalk.gray(`Request: ${description}\n`));

    const result = await generateObject({
      model: aiService.model,
      schema: ApplicationSchema,
      prompt: `Create a complete, production-ready application for: ${description}

CRITICAL REQUIREMENTS:
1. Generate ALL files needed for the application to run
2. Include package.json with ALL dependencies and correct versions (if needed)
3. Include README.md with setup instructions
4. Include configuration files (.gitignore, etc.) if needed
5. Write clean, well-commented, production-ready code
6. Include error handling and input validation
7. Use modern JavaScript/TypeScript best practices
8. Make sure all imports and paths are correct
9. NO PLACEHOLDERS - everything must be complete and working
10. For simple HTML/CSS/JS projects, you can skip package.json if not needed

Provide:
- A meaningful kebab-case folder name
- All necessary files with complete content
- Setup commands (for example: cd folder, npm install, npm run dev OR just open index.html)
- Make it visually appealing and functional`,
    });

    const application = result.object;

    printSystem(
      chalk.greenBright(`\n ☑️Generated:${application.folderName}\n`),
    );
    printSystem(chalk.gray(`Description:${application.description}`));

    if (application.files.length === 0) {
      throw new Error("No files were generated");
    }

    displayFileTree(application.files, application.folderName);

    printSystem(chalk.cyan("\n Creating files....\n"));

    const appDir = await createApplicationFiles(
      cwd,
      application.folderName,
      application.files,
    );

    printSystem("☑️Application created successfully.");
    printSystem(`🗃️ Location : ${chalk.bold(appDir)}\n`);

    if (application.setupCommands.length > 0) {
      printSystem(chalk.cyan("Next steps:\n"));
      printSystem(chalk.white("```bash"));

      application.setupCommands.forEach((cmd) => {
        printSystem(chalk.white(cmd));
      });

      printSystem(chalk.white("```\n"));
    }

    return {
      folderName: application.folderName,
      appDir,
      files: application.files.map((f) => f.path),
      commands: application.setupCommands,
      success: true,
    };
  } catch (err) {
    printSystem(
      chalk.red(`\n❌ Error generating application: ${err.message}\n`),
    );
    if (err.stack) {
      printSystem(chalk.dim(err.stack));
    }
    throw err;
  }
}
