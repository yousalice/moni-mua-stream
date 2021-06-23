/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ensureFileSync, writeFile, readFileSync, readFile } from 'fs-extra'

export class FileStream {
  private filename: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: any[] = []
  private writeTimer!: NodeJS.Timeout
  private writeState = true
  constructor(filename: string) {
    this.filename = filename
    ensureFileSync(this.filename)
  }

  /**
   * 逐行异步飞堵塞写入文件内容
   * @param content 行文件内容
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeln(content?: any): void {
    content && this.cache.push(content)
    this.writeTimer && clearTimeout(this.writeTimer)
    if (!this.writeState) return
    this.writeState = false
    content = this.cache.map((_) => typeof _ === 'string' ? _ : JSON.stringify(_)).join('\n')
    readFile(this.filename, (_err, data) => {
      if (_err) return
      const fileContent = data ? data.toString('utf-8') : ''
      content = fileContent + '\n' + content
      this.cache = []
      writeFile(this.filename, content, () => {
        if (_err) return
        this.writeState = true
        if (this.cache.length > 0) {
          this.writeTimer = setTimeout(() => this.writeln(), 300)
        }
      })
    })
  }

  // 同步读取内容
  read() {
    return readFileSync(this.filename, 'utf-8')
  }
}
