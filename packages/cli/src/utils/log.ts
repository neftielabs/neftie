import chalk from "chalk";

export default class Log {
  public log(m: string) {
    // eslint-disable-next-line no-console
    console.log(m);
  }

  public logColor(m: string, c: typeof chalk.ForegroundColor = "white") {
    this.log(chalk[c](m));
  }

  public notice(m: string) {
    this.log(`${chalk.yellow("▲")} ${m}`);
  }

  public error(m: string) {
    this.log(`${chalk.red("✖")} ${m}`);
  }

  public info(m: string) {
    this.log(`${chalk.blue("➤")} ${m}`);
  }

  public success(m: string) {
    this.log(`${chalk.green("✔")} ${m}`);
  }
}
