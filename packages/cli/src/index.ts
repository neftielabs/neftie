import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { addCommand } from "./commands/add";

yargs(hideBin(process.argv))
  .option("dry", {
    alias: "d",
    type: "boolean",
    description: "Dry run",
  })
  .command(
    "add <entity> <name>",
    "add an entity",
    (y) =>
      y
        .positional("entity", {
          describe: "entity type",
          choices: ["controller", "service", "provider", "middleware"] as const,
          demandOption: true,
        })
        .positional("name", {
          describe: "entity name",
          demandOption: true,
          type: "string",
        }),
    (a) => addCommand(a.entity, a.name, !!a.dry)
  )
  .parse();
