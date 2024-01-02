import { LogConfig } from './types'

export const MAIN_LOGGER_NAME = 'main'

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error']

export const COLOR_CONFIG = {
  debug: 'linear-gradient(135deg, #CE9FFC 10%, #7367F0 100%);',
  info: 'linear-gradient(135deg, #97ABFF 10%, #123597 100%);',
  warn: 'linear-gradient(135deg, #FEC163 10%, #D04313 100%);',
  error: 'linear-gradient(135deg, #FF5D25 10%, #FF0410 100%);',
}

export const LIGGER_DEFAULT_INIT_CONFIG: LogConfig = {
  loggerInitOptions: {
    level: 'info',
    enabled: false,
    styled: true,
    logTime: true,
  },
}
