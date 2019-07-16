import { Backup } from "./Backup"
import { getBackup } from "./backupStorage"

export const shareBackup = async (name: string) => {
  const backup = await getBackup(name)

  const json = JSON.stringify(backup)
  const escaped = encodeURIComponent(json)
  const base64 = btoa(escaped)

  window.history.replaceState(undefined, "", `?backup=${base64}`)
}

const decodeBackup = (base64: string) => {
  try {
    const escaped = atob(base64)
    const unescaped = decodeURIComponent(escaped)
    return JSON.parse(unescaped) as Backup
  } catch {
    return null
  }
}

let cachedBackup: undefined | null | Backup

export const getSharedBackup = (url: URL) => {
  if (cachedBackup !== undefined) return cachedBackup

  const backupParam = url.searchParams.get("backup")
  if (backupParam) {
    const backup = decodeBackup(backupParam)

    if (!process.env.SSR) {
      if (backup) console.log("Loaded with shared backup:", backup)
      cachedBackup = backup
    }

    return backup
  }
}
