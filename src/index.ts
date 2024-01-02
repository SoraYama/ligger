import { initLoggers, isWeChatMiniProgram, isWeb } from './env'
import Booster from './booster'
import {
  COLOR_CONFIG,
  LOG4FE_INIT_CONFIG,
  MAIN_LOGGER_NAME,
} from './constants'
import Logger from './logger'
import { LogConfig, LoggerInitParam } from './types'
import { getPrefixedText, noop } from './utils'
import { isMiniApp } from 'universal-env'

declare global {
  interface Window {
    __LIGGER__: Ligger;
  }
}

class DevToolsBooster {
  [key: string]: Booster;
}

class Ligger {
  private static _instance: null | Ligger = null

  static getInstance(config: LogConfig = LOG4FE_INIT_CONFIG): Ligger {
    return Ligger._instance || new Ligger(config)
  }

  readonly colors = COLOR_CONFIG

  loggers = new Map<string, Logger>()

  config: LogConfig = {}

  constructor(params: LogConfig) {
    if (Ligger._instance) {
      throw new Error(getPrefixedText('Log4fe is singleton'))
    }
    if (typeof params === 'undefined') {
      throw new Error(getPrefixedText('Init param must not be empty'))
    }
    if (typeof params === 'object') {
      this._parse(params)
    } else {
      throw new Error(getPrefixedText('Bad init param format'))
    }
    this.init()
  }

  list = () => {
    if (!this._initLoggers) {
      return
    }

    const relist = this.list
    const output = new DevToolsBooster()
    output.MAIN = new Booster(this.loggers.get(MAIN_LOGGER_NAME)!, relist)
    this.loggers.forEach((lgr, key) => {
      if (key === MAIN_LOGGER_NAME) {
        return
      }
      output[key] = new Booster(lgr, relist)
    })
    this._getConsoleMethod('table')(output)
  }

  getLogger(name?: string, options?: Omit<LoggerInitParam, 'name'>) {
    if (!name) {
      return this.loggers.get(MAIN_LOGGER_NAME)
    }

    const _options = {
      ...(options || {}),
    }

    if (this._isInGlobalDebug) {
      _options.enabled = true
      _options.level = 'debug'
    }

    const lgrInMap = this.loggers.get(name)

    if (!lgrInMap) {
      const logger = new Logger({ name, ...(_options || {}) })
      this.loggers.set(name, logger)
      return logger
    }

    return lgrInMap
  }

  private get _initLoggers() {
    return initLoggers
  }

  private get _isInGlobalDebug() {
    return typeof this._initLoggers === 'string' && this._initLoggers.length > 0 && this._initLoggers.indexOf('ALL') > -1
  }

  public init() {
    Ligger._instance = this
    this._initLogger()

    if (isWeb) {
      window.__LIGGER__ = this
    } else if (isWeChatMiniProgram || isMiniApp) {
      if (getApp()?.globalData) {
        getApp().globalData.__LIGGER__ = this
      }
    }
  }

  private _parse(params: LogConfig) {
    const config = {
      ...LOG4FE_INIT_CONFIG,
      ...params,
    }

    this.config = config
  }

  private _initLogger() {
    this.loggers.set(
      MAIN_LOGGER_NAME,
      new Logger({
        name: MAIN_LOGGER_NAME,
        ...this.config.loggerInitOptions,
        enabled: this._isInGlobalDebug || this.config.loggerInitOptions?.enabled || false,
        level: this._isInGlobalDebug ? 'debug' : this.config.loggerInitOptions?.level || 'info',
      }),
    )

    // 通过 debug 参数开启相关日志打印
    if (typeof this._initLoggers === 'string' && this._initLoggers.length) {
      this._initLoggers.split(',').filter((s) => s !== 'ALL').forEach((loggerName) => {
        const logger = this.getLogger(loggerName, {
          ...this.config.loggerInitOptions,
        })

        logger!.setLevel('debug')
        logger!.enable()
      })
    }
  }

  private _getConsoleMethod(method: keyof Console) {
    if (console && typeof console[method] === 'function') {
      // @ts-expect-error bind console
      return console[method].bind(console) || noop
    }
    return noop
  }
}

export default Ligger
