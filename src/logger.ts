import { COLOR_CONFIG, LOG_LEVELS } from './constants'
import {
  _LogOptions,
  GetPrefixFunc,
  GetStyleCSSFunc,
  LoggerInitParam,
  LoggerLevel,
} from './types'
import { getPrefixedText, getTimeString, styledSupport } from './utils'

class Logger {
  level: LoggerLevel

  private enabled: boolean

  private name: string

  private styled: boolean

  private styleCSS?: GetStyleCSSFunc | string

  private getPrefix?: GetPrefixFunc | string

  private _logOnceSet: Set<string>

  constructor({
    name,
    enabled = true,
    level = 'info',
    styled = true,
    prefix,
    styleCSS,
  }: LoggerInitParam) {
    if (!name || name.length <= 0 || typeof name !== 'string') {
      throw new Error(getPrefixedText('Logger name invalid'))
    }
    this.name = name
    this.level = level
    this.enabled = enabled
    this.styled = styled && styledSupport
    this.styleCSS = styleCSS
    this.getPrefix = prefix
    this._logOnceSet = new Set()
  }

  setLevel(level: LoggerLevel) {
    this.level = level
  }

  get isEnabled() {
    return this.enabled
  }

  enable = () => {
    this.enabled = true
  }

  disable = () => {
    this.enabled = false
  }

  debug(...args: unknown[]) {
    this._log(args, { level: 'debug' })
  }

  info(...args: unknown[]) {
    this._log(args, { level: 'info' })
  }

  warn(...args: unknown[]) {
    this._log(args, { level: 'warn' })
  }

  error(...args: unknown[]) {
    this._log(args, { level: 'error' })
  }

  trace(...args: unknown[]) {
    this._log(args, { level: 'debug', needStyle: false })
  }

  table(...args: unknown[]) {
    this._log(args, { level: 'debug', needStyle: false })
  }

  debugOnce(...args: unknown[]) {
    this._log(args, { level: 'debug', isOnce: true })
  }

  infoOnce(...args: unknown[]) {
    this._log(args, { level: 'info', isOnce: true })
  }

  warnOnce(...args: unknown[]) {
    this._log(args, { level: 'warn', isOnce: true })
  }

  errorOnce(...args: unknown[]) {
    this._log(args, { level: 'error', isOnce: true })
  }

  private _log(msgs: unknown[], options: _LogOptions) {
    const now = new Date()
    const { level, time = now, color = level, needStyle = true, isOnce = false } = options

    if (LOG_LEVELS.indexOf(this.level) > LOG_LEVELS.indexOf(level) || !this.enabled) {
      return
    }

    const logMessageStr = msgs.filter((m) => typeof m !== 'function').map((m) => (typeof m === 'object' ? JSON.stringify(m) : m)).join('|')

    if (isOnce) {
      if (this._logOnceSet.has(logMessageStr)) {
        return
      }

      this._logOnceSet.add(logMessageStr)
    }

    const timeStr = getTimeString(time)

    const prefix = this.getPrefix
      ? typeof this.getPrefix === 'string'
        ? this.getPrefix
        : this.getPrefix(timeStr, this.name, this.level)
      : `[LIGGER] ${timeStr} <${this.name.toUpperCase()}> `

    if (this.styled && needStyle) {
      console[level](
        `%c${prefix}`,
        this.styleCSS
          ? typeof this.styleCSS === 'string'
            ? this.styleCSS
            : this.styleCSS(color)
          : `background-image:${COLOR_CONFIG[color]};color:white;padding:0 4px;border-radius:3px;line-height:20px`,
        ...msgs,
      )
    } else {
      console[level](...msgs)
    }
  }
}

export default Logger
