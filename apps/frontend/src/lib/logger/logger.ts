/* eslint-disable no-console */
import { isServer } from "utils/app";

type LoggerLevels = {
  error: number;
  warn: number;
  info: number;
  debug: number;
};

type LoggerColors = {
  [K in keyof LoggerLevels]: string;
};

type LoggerConfig<IsInput extends boolean = true> = {
  level: IsInput extends true ? keyof LoggerLevels : number;
  colors: LoggerColors;
  timestamps?: boolean;
  showLevel?: boolean;
};

type LogLevelFunc = (message: string, ...meta: any[]) => void;

export class Logger {
  /**
   * The instance config
   */
  private config: LoggerConfig<false>;

  /**
   * The different logging levels
   */
  private loggerLevels: LoggerLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  constructor(config: LoggerConfig) {
    this.config = {
      ...config,
      level: this.loggerLevels[config.level],
    };
  }

  /**
   * Determines if a log should go through based
   * on the maximum logging level
   */
  private canLog(level: number) {
    return this.config.level >= level;
  }

  /**
   * Log level color
   */
  private getLogLevelColor(level: keyof LoggerLevels): string {
    return `color: ${this.config.colors[level]}`;
  }

  /**
   * Handles all the logging logic
   */
  private log(level: number, message: string, ...meta: any[]): void {
    const shouldLog = this.canLog(level);
    const levelKey = Object.keys(this.loggerLevels)[
      level
    ] as keyof LoggerLevels;

    if (shouldLog) {
      // Order of elements: level > message > ...meta
      const styles: string[] = [];
      const elements: string[] = [];

      // Timestamps
      if (this.config.timestamps) {
        styles.push("color: white");
        elements.push(`[${new Date().toLocaleTimeString()}]`);
      }

      // Log level
      if (this.config.showLevel) {
        styles.push(this.getLogLevelColor(levelKey));
        elements.push(`${levelKey}:   `);
      }

      // Message
      styles.push(this.getLogLevelColor(levelKey));
      elements.push(message);

      // Assemble the thing
      const elementsToLog = [elements.join(" ")];

      if (!isServer) {
        const stringToLog = "%c" + elements.join(" %c");
        elementsToLog[0] = stringToLog;
        elementsToLog.push(...[...styles, ...meta]);
      }

      // Log it
      console.log(...elementsToLog);
    }
  }

  public debug: LogLevelFunc = (...args) =>
    this.log(this.loggerLevels.debug, ...args);

  public info: LogLevelFunc = (...args) =>
    this.log(this.loggerLevels.info, ...args);

  public warn: LogLevelFunc = (...args) =>
    this.log(this.loggerLevels.warn, ...args);

  public error: LogLevelFunc = (...args) =>
    this.log(this.loggerLevels.error, ...args);

  public raw = (...args: any[]) => console.log(...args);
}
