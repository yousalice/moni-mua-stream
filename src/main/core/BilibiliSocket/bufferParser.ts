import { inflate } from 'pako'
import { TextDecoder, TextEncoder } from 'util'

export function bufferDecoder(buffer: Uint8Array): Array < Record < string, unknown >> {
  const arr = new Uint8Array(buffer)
  const view = new DataView(arr.buffer)
  const packs = []
  let offset = 0
  while (offset < arr.byteLength) {
    const protocol = view.getInt16(6 + offset)
    const type = view.getInt32(8 + offset)
    if (type === 5) {
      const section = arr.slice(offset + view.getInt16(4 + offset), view.getInt32(offset) + offset)
      if (protocol === 0) {
        packs.push(JSON.parse(new TextDecoder().decode(section)))
      }
      if (protocol === 2) {
        packs.push(bufferDecoder(inflate(section)))
      }
    }
    if (type === 3) {
      packs.push({ cmd: 'OPERATION', data: { count: view.getInt32(16) } })
    }
    offset += view.getInt32(offset)
  }
  return packs
}

export function getBinary(type: number, body: Uint8Array): Uint8Array {
  const head = new ArrayBuffer(16)
  const headDataView = new DataView(head)
  headDataView.setInt32(0, head.byteLength + body.byteLength)
  headDataView.setInt16(4, 16)
  headDataView.setInt16(6, 1)
  headDataView.setInt32(8, type) // verify
  headDataView.setInt32(12, 1)

  const tmp = new Uint8Array(16 + body.byteLength)
  tmp.set(new Uint8Array(head), 0)
  tmp.set(body, 16)

  return tmp
}

export function textEncode(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}
