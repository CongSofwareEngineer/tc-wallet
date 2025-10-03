const create = () => {
  return window.localStorage
}

export const getDataLocal = (key: string) => {
  try {
    const storage = create()
    const jsonValue = storage.getItem(key) ?? ''

    return JSON.parse(jsonValue)
  } catch {
    return ''
  }
}

export const removeDataLocal = (key: string) => {
  try {
    const storage = create()

    storage.removeItem(key)

    return true
  } catch {
    return false
  }
}

export const saveDataLocal = (key: string, value: any) => {
  try {
    const storage = create()

    storage.setItem(key, JSON.stringify(value))

    return true
  } catch {
    return false
  }
}
