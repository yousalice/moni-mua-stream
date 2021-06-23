export function durationFormat(time: number): string {
  time = time / 1000
  const s = Math.floor(time % 60)
  const h = Math.floor(time / 60 / 60)
  const m = Math.floor(time / 60) - h * 60
  return `${padZero(h)}:${padZero(m)}:${padZero(s)}`
}

export function padLeft(str: string, fill: string): string {
  if (str.length >= fill.length) return str
  return str.padStart(fill.length, fill.substr(0, fill.length - str.length))
}

export function padZero(t: number): string {
  return (t + '').padStart(2, '0')
}
