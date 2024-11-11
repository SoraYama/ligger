import { isNode, isWeChatMiniProgram, isWeb, isWeex } from 'universal-env'
import { MAIN_LOGGER_NAME } from './constants'

export {
  isWeChatMiniProgram,
  isNode,
  isWeb,
  isWeex,
}

export const initLoggers: string = (() => {
  let initLoggers: string | null | undefined = ''

  if (isNode) {
    initLoggers = process?.env?.INIT_LOGGERS
  }
  if (isWeChatMiniProgram) {
    initLoggers = wx.getStorageSync<string>('initLoggers')
  }
  if (isWeb && isWeex) {
    const qs = new URLSearchParams(location.search)
    initLoggers = qs.get('initLoggers')
  }
  return initLoggers ?? MAIN_LOGGER_NAME
})()
