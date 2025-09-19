export const cloneDeep = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const lowercase = (val: string | null | undefined) => {
  return val ? val.toLowerCase() : val
}

export const uppercase = (val: string | null | undefined) => {
  return val ? val.toUpperCase() : val
}

export const capitalize = (val: string | null | undefined) => {
  if (!val || val.length === 0) return ''
  return val.charAt(0).toUpperCase() + val.slice(1)
}

export const numberWithCommas = (num: number | string | bigint | null | undefined) => {
  if (num === null || num === undefined) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
