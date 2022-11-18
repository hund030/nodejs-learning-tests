import yargs, { exit } from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .command(
    "generate [yaml]",
    "generate templates based on the definition yaml file.",
    (yargs: any) => {
      return yargs.positional("yaml", {
        describe: "template definition",
      });
    },
    (argv: any) => {
      if (argv.yaml) {
        console.info(`start generate templates for :${argv.yaml}.`);
      }
      if (argv.all) {
        console.info(`start re-generate all templates.`);
      }
    }
  )
  .check((argv: any) => {
    if (!argv.yaml && !argv.all) {
      throw new Error();
    }
    if (argv.yaml && argv.all) {
      throw new Error();
    }
    return true;
  })
  .option("all", {
    alias: "a",
    type: "boolean",
    description: "Re-generate all templates",
  })
  .parse();
