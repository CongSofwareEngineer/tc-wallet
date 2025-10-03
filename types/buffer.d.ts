// Global Buffer type declaration for TypeScript
// This ensures TypeScript recognizes Buffer as a global variable

declare global {
  var Buffer: {
    from(
      data: string | Uint8Array | number[],
      encoding?: string
    ): {
      toString(encoding?: string): string
      length: number
      data: Uint8Array
    }
    alloc(
      size: number,
      fill?: number
    ): {
      toString(encoding?: string): string
      length: number
      data: Uint8Array
    }
    byteLength(data: string, encoding?: string): number
    isBuffer(obj: any): boolean
    concat(
      list: any[],
      totalLength?: number
    ): {
      toString(encoding?: string): string
      length: number
      data: Uint8Array
    }
  }
}

export { }

