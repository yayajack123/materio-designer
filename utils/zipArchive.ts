export interface ZipFileEntry {
  name: string
  content: string
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let index = 0; index < 256; index += 1) {
    let crc = index
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) !== 0 ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1)
    }
    table[index] = crc >>> 0
  }

  return table
})()

const computeCrc32 = (bytes: Uint8Array): number => {
  let crc = 0xFFFFFFFF
  for (let index = 0; index < bytes.length; index += 1) {
    crc = CRC32_TABLE[(crc ^ bytes[index]) & 0xFF] ^ (crc >>> 8)
  }

  return (crc ^ 0xFFFFFFFF) >>> 0
}

const toDosDateTime = (date: Date) => {
  const year = Math.max(1980, date.getFullYear())
  const dosTime = ((date.getHours() & 0x1F) << 11)
    | ((date.getMinutes() & 0x3F) << 5)
    | ((Math.floor(date.getSeconds() / 2)) & 0x1F)
  const dosDate = (((year - 1980) & 0x7F) << 9)
    | (((date.getMonth() + 1) & 0x0F) << 5)
    | (date.getDate() & 0x1F)

  return { dosTime, dosDate }
}

/**
 * Builds a standard uncompressed (STORE) PKZIP archive in memory with UTF-8 filenames.
 */
export const buildZipBytes = (entries: ZipFileEntry[], timestamp = new Date()): Uint8Array => {
  const encoder = new TextEncoder()
  const { dosTime, dosDate } = toDosDateTime(timestamp)
  const UTF8_FLAG = 0x0800

  const prepared = entries.map(entry => {
    const normalizedName = entry.name.replace(/^\/+/, '')
    const nameBytes = encoder.encode(normalizedName)
    const dataBytes = encoder.encode(entry.content)
    const crc32 = computeCrc32(dataBytes)

    return { nameBytes, dataBytes, crc32 }
  })

  const localChunks: Uint8Array[] = []
  const centralChunks: Uint8Array[] = []
  let offset = 0

  for (const item of prepared) {
    const localHeader = new Uint8Array(30 + item.nameBytes.length)
    const localView = new DataView(localHeader.buffer)
    localView.setUint32(0, 0x04034B50, true)
    localView.setUint16(4, 20, true)
    localView.setUint16(6, UTF8_FLAG, true)
    localView.setUint16(8, 0, true)
    localView.setUint16(10, dosTime, true)
    localView.setUint16(12, dosDate, true)
    localView.setUint32(14, item.crc32, true)
    localView.setUint32(18, item.dataBytes.length, true)
    localView.setUint32(22, item.dataBytes.length, true)
    localView.setUint16(26, item.nameBytes.length, true)
    localView.setUint16(28, 0, true)
    localHeader.set(item.nameBytes, 30)

    localChunks.push(localHeader, item.dataBytes)

    const centralHeader = new Uint8Array(46 + item.nameBytes.length)
    const centralView = new DataView(centralHeader.buffer)
    centralView.setUint32(0, 0x02014B50, true)
    centralView.setUint16(4, 20, true)
    centralView.setUint16(6, 20, true)
    centralView.setUint16(8, UTF8_FLAG, true)
    centralView.setUint16(10, 0, true)
    centralView.setUint16(12, dosTime, true)
    centralView.setUint16(14, dosDate, true)
    centralView.setUint32(16, item.crc32, true)
    centralView.setUint32(20, item.dataBytes.length, true)
    centralView.setUint32(24, item.dataBytes.length, true)
    centralView.setUint16(28, item.nameBytes.length, true)
    centralView.setUint16(30, 0, true)
    centralView.setUint16(32, 0, true)
    centralView.setUint16(34, 0, true)
    centralView.setUint16(36, 0, true)
    centralView.setUint32(38, 0, true)
    centralView.setUint32(42, offset, true)
    centralHeader.set(item.nameBytes, 46)

    centralChunks.push(centralHeader)
    offset += localHeader.length + item.dataBytes.length
  }

  const centralDirectorySize = centralChunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const endRecord = new Uint8Array(22)
  const endView = new DataView(endRecord.buffer)
  endView.setUint32(0, 0x06054B50, true)
  endView.setUint16(4, 0, true)
  endView.setUint16(6, 0, true)
  endView.setUint16(8, prepared.length, true)
  endView.setUint16(10, prepared.length, true)
  endView.setUint32(12, centralDirectorySize, true)
  endView.setUint32(16, offset, true)
  endView.setUint16(20, 0, true)

  const totalLength = offset + centralDirectorySize + endRecord.length
  const archive = new Uint8Array(totalLength)
  let cursor = 0

  for (const chunk of [...localChunks, ...centralChunks, endRecord]) {
    archive.set(chunk, cursor)
    cursor += chunk.length
  }

  return archive
}

export const downloadZipArchive = (filename: string, entries: ZipFileEntry[]): void => {
  if (typeof document === 'undefined') return
  const bytes = buildZipBytes(entries)
  const bufferCopy = new Uint8Array(bytes.byteLength)
  bufferCopy.set(bytes)
  const blob = new Blob([bufferCopy.buffer], { type: 'application/zip' })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}
