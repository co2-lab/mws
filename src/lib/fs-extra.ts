import fs from 'node:fs'
import path from 'node:path'

const checkPath = function checkPath(pth) {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path.parse(pth).root, ''))

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth}`) as Error & {
        code: string
      }
      error.code = 'EINVAL'
      throw error
    }
  }
}

const getMode = options => {
  const defaults = { mode: 0o777 }
  if (typeof options === 'number') return options
  return { ...defaults, ...options }.mode
}

export const ensureDirSync = (dir: string, options?: any) => {
  checkPath(dir)

  return fs.mkdirSync(dir, {
    mode: getMode(options),
    recursive: true,
  })
}
