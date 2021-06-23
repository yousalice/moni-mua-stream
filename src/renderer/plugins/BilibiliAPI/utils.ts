export function toUpperCase(str: string): string {
  return str.replace(/_(\w)/g, function (m: string, n: string) {
    return n.toUpperCase()
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function objKeyToUpperCase(data: any = {}): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = {}
  Object.keys(data).forEach((key: string) => {
    if (Array.isArray(data[key])) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data[key] = data[key].map((item: any) => objKeyToUpperCase(item))
    }
    if (Object.prototype.toString.call(data[key]) === '[object Object]') {
      data[key] = objKeyToUpperCase(data[key])
    }
    res[toUpperCase(key)] = data[key]
  })
  return res
}
