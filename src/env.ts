import { isNode, isWeChatMiniProgram, isWeb } from 'universal-env'
import { MAIN_LOGGER_NAME } from './constants'

export {
  isWeChatMiniProgram,
  isNode,
  isWeb,
}

export const initLoggers: string = (() => {
  if (isNode) {
    return process.env.INIT_LOGGERS ?? ''
  }
  if (isWeChatMiniProgram) {
    return wx.getStorageSync<string>('initLoggers') ?? ''
  }
  if (isWeb) {
    const qs = new URLSearchParams(location.search)
    return qs.get('initLoggers') ?? ''
  }
  return MAIN_LOGGER_NAME
})()
