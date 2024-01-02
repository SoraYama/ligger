import { isNode, isWeChatMiniProgram, isWeb } from 'universal-env'

export {
  isWeChatMiniProgram,
  isNode,
  isWeb,
}

export const initLoggers: string = (() => {
  if (isNode) {
    return process.env.INIT_LOGGERS ?? ''
  }
  if (isWeb) {
    const qs = new URLSearchParams(location.search)
    return qs.get('initLoggers') ?? ''
  }
  if (isWeChatMiniProgram) {
    return wx.getStorageSync<string>('initLoggers') ?? ''
  }
  return 'main'
})()
