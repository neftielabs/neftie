import fs from "fs";
import path from "path";

import chalk from "chalk";

import { exitProcess, firstUpper } from "../utils/helpers";
import Log from "../utils/log";

type EntityType = "provider" | "controller" | "service" | "middleware";

const ROOT_DIR = path.join(__dirname, "../../../../apps/backend/src/api");

const ENTITY_DIRS: Record<EntityType, string> = {
  controller: path.join(ROOT_DIR, "controllers"),
  provider: path.join(ROOT_DIR, "providers"),
  service: path.join(ROOT_DIR, "services"),
  middleware: path.join(ROOT_DIR, "middleware"),
};

export const addCommand = (entity: EntityType, name: string, dry: boolean) => {
  const log = new Log();

  if (dry) {
    log.notice("Dry run");
    log.log("  No files will be modified");
    log.log("\n");
  }

  if (name.startsWith("/")) {
    log.error("Entity name cannot start with slash");
    exitProcess();
  }

  const hasPath = name.lastIndexOf("/") !== -1;
  const entityPath = hasPath ? name.split("/").slice(0, -1).join("/") : "";
  const entityName = (hasPath ? name.split("/").slice(-1)[0] : name).replace(
    /\..*$/,
    ""
  );
  const fileName = `${entityName}.${entity}.ts`;

  const targetDirectory = path.join(ENTITY_DIRS[entity], entityPath);
  const targetFile = path.join(targetDirectory, fileName);
  const targetIndex = path.join(targetDirectory, "index.ts");

  if (fs.existsSync(targetFile)) {
    log.error(`${entity} already exists`);
    exitProcess();
  }

  const directoryExists = fs.existsSync(targetDirectory);

  if (dry) {
    log.info(`Target directory    ${targetDirectory}`);
    log.info(`Target file         ${targetFile}`);
    log.info(`Target index        ${targetIndex}`);
  }

  if (!directoryExists) {
    if (!dry) {
      fs.mkdirSync(targetDirectory, { recursive: true });
    } else {
      log.info(`Creating target directory`);
    }
  }

  const indexExists = fs.existsSync(targetIndex);
  const exportString = `export * as ${entityName}${firstUpper(
    entity
  )} from "./${fileName.replace(".ts", "")}";\n`;

  if (!dry) {
    fs[indexExists ? "appendFileSync" : "writeFileSync"](
      targetIndex,
      exportString
    );
  } else {
    log.info(
      `${indexExists ? "Append" : "Write"} index        ${exportString}`
    );
  }

  if (!dry) {
    fs.writeFileSync(targetFile, `export default "";\n`);
  } else {
    log.info(`Write file          ${targetFile}`);
  }

  if (hasPath) {
    const directories = entityPath.split("/");

    for (let i = directories.length; i >= 0; i--) {
      const directory = directories.slice(0, i).join("/");
      const targetNestedIndex = path.join(
        ENTITY_DIRS[entity],
        directory,
        "index.ts"
      );
      const parentDirectory = directories[i];

      const nestedExportString = `export * from "./${parentDirectory}";`;

      if (fs.existsSync(targetNestedIndex)) {
        const hasCurrentExport = fs
          .readFileSync(targetNestedIndex, "utf-8")
          .includes(nestedExportString);

        if (!dry && !hasCurrentExport) {
          fs.appendFileSync(targetNestedIndex, nestedExportString + "\n");
        } else if (dry) {
          log.info(`Appending to index  ${targetNestedIndex}`);
        }
      } else if (!dry) {
        fs.writeFileSync(targetNestedIndex, nestedExportString + "\n");
      } else {
        log.info(`Creating index      ${targetNestedIndex}`);
      }
    }
  }

  log.log("\n");
  log.success(
    `Created ${entity} ${chalk.cyan(fileName)} ${
      entityPath ? `at ${entityPath}` : ""
    }`
  );
  exitProcess(1);
};
