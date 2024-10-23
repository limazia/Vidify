import chalk from "chalk";

export type LogLevel = "log" | "error" | "warn" | "debug" | "fatal" | "info";

const DEFAULT_LOG_LEVELS: LogLevel[] = [
  "log",
  "error",
  "warn",
  "debug",
  "fatal",
  "info",
];

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  debug: 0,
  log: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

const isColorAllowed = () => !process.env.NO_COLOR;
const colorIfAllowed = (colorFn: (text: string) => string) => (text: string) =>
  isColorAllowed() ? colorFn(text) : text;

const colors = {
  bold: colorIfAllowed(chalk.bold),
  green: colorIfAllowed(chalk.green),
  yellow: colorIfAllowed(chalk.yellow),
  red: colorIfAllowed(chalk.red),
  magentaBright: colorIfAllowed(chalk.magentaBright),
  cyan: colorIfAllowed(chalk.cyan),
};

export interface ConsoleLoggerOptions {
  logLevels?: LogLevel[];
}

function isLogLevelEnabled(
  targetLevel: LogLevel,
  logLevels: LogLevel[] | undefined
): boolean {
  if (!logLevels || logLevels.length === 0) {
    return false;
  }
  if (logLevels.includes(targetLevel)) {
    return true;
  }
  const highestLogLevelValue = logLevels
    .map((level) => LOG_LEVEL_VALUES[level])
    .sort((a, b) => b - a)[0];

  const targetLevelValue = LOG_LEVEL_VALUES[targetLevel];
  return targetLevelValue >= highestLogLevelValue;
}

export class Logger {
  private originalContext?: string;
  private options: ConsoleLoggerOptions;

  constructor(context?: string, options: ConsoleLoggerOptions = {}) {
    this.options = {
      ...options,
      logLevels: options.logLevels || DEFAULT_LOG_LEVELS,
    };
    if (context) {
      this.originalContext = context;
    }
  }

  log(...messages: any[]) {
    if (!this.isLevelEnabled("log")) {
      return;
    }
    this.printMessages(messages, this.getContext(), "log");
  }

  error(...messages: any[]) {
    if (!this.isLevelEnabled("error")) {
      return;
    }
    this.printMessages(messages, this.getContext(), "error", "stderr");
  }

  warn(...messages: any[]) {
    if (!this.isLevelEnabled("warn")) {
      return;
    }
    this.printMessages(messages, this.getContext(), "warn");
  }

  debug(...messages: any[]) {
    if (!this.isLevelEnabled("debug")) {
      return;
    }
    this.printMessages(messages, this.getContext(), "debug");
  }

  fatal(...messages: any[]) {
    if (!this.isLevelEnabled("fatal")) {
      return;
    }
    this.printMessages(messages, this.getContext(), "fatal", "stderr");
  }

  info(...messages: any[]) {
    if (!this.isLevelEnabled("info")) {
      return;
    }
    this.printMessages(messages, this.getContext(), "info");
  }

  private isLevelEnabled(level: LogLevel): boolean {
    return isLogLevelEnabled(level, this.options.logLevels);
  }

  private printMessages(
    messages: any[],
    context = "",
    logLevel: LogLevel = "log",
    writeStreamType?: "stdout" | "stderr"
  ): void {
    const formattedMessage = this.formatMessage(messages, context, logLevel);
    process[writeStreamType ?? "stdout"].write(formattedMessage + "\n");
  }

  private getContext() {
    return this.originalContext || "";
  }

  private formatMessage(messages: any[], context: string, logLevel: LogLevel) {
    const color = this.getColorByLogLevel(logLevel);
    const contextMessage = colors.yellow(`[${context}] `);
    const timestamp = dateTimeFormatter.format(new Date());
    const formattedLogLevel = logLevel.toUpperCase();
  
    const concatenatedMessages = messages
      .map(msg => {
        if (msg instanceof Error) {
          return `Error: ${msg.message}`; //\nStack: ${msg.stack}
        }
        return typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg;
      })
      .join(' ');
  
    return `${color("[Vidify]")} - ${timestamp} - ${color(
      formattedLogLevel
    )} ${color(contextMessage)}${color(concatenatedMessages)}`;
  }

  private getColorByLogLevel(level: LogLevel) {
    switch (level) {
      case "debug":
        return colors.magentaBright;
      case "warn":
        return colors.yellow;
      case "error":
        return colors.red;
      case "fatal":
        return colors.bold;
      case "info":
        return colors.cyan;
      default:
        return colors.green;
    }
  }
}
