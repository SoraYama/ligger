const autoComplete = (dig: string) => (dig.length === 1 ? `0${dig}` : dig)

export const getTimeString = (time: Date | null) => {
  if (!time) {
    time = new Date()
  }
  const [h, m, s] = [time.getHours(), time.getMinutes(), time.getSeconds()].map((d) =>
    autoComplete(d.toString()))
  return `${h}:${m}:${s}`
}

export const getPrefixedText = (txt: string) => `[LIGGER] - ${txt}`

export const noop = () => {}
