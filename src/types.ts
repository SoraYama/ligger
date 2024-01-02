export type LoggerInitOptions = Omit<LoggerInitParam, 'name'>;

export interface LogConfig {
  loggerInitOptions?: LoggerInitOptions;
}

export type LoggerLevel = 'debug' | 'info' | 'warn' | 'error';

export type GetPrefixFunc = (timeStr: string, loggerName: string, level: LoggerLevel) => string;

export type GetStyleCSSFunc = (colorEnum: ColorEnums) => string;

export interface LoggerInitParam {
  name: string;
  /**
   * 日志级别，逻辑同类似 winston 或者 log4j 这种日志组件
   * 级别从大到小为 'error' > 'warn' > 'info' > 'debug'
   * 如设置为 'info' 则只会展示 'info'、'warn'、'error' 级别的日志
   */
  level?: LoggerLevel;
  /**
   * 是否启用
   */
  enabled?: boolean;
  /**
   * 是否装饰
   */
  styled?: boolean;
  /**
   * 控制台装饰用的 CSS，如传入函数则入参如上
   */
  styleCSS?: GetStyleCSSFunc | string;
  /**
   * 每条日志的前缀，如传入函数则入参如上
   */
  prefix?: GetPrefixFunc | string;
  /**
   * 是否打印时间
   */
  logTime?: boolean;
}

export type ColorEnums = LoggerLevel;

export interface _LogOptions {
  level: LoggerLevel;
  needStyle?: boolean;
  isOnce?: boolean;
  time?: Date;
  color?: ColorEnums;
}
