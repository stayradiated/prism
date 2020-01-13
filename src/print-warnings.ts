import style from 'ansi-styles'

import { Warning, Path } from './types'

const formatPath = (path: Path): string => {
  return (
    'root' +
    path
      .map((item) => {
        if (typeof item === 'number') {
          return `[${style.green.open}${item}${style.green.close}]`
        } else {
          return `.${style.blue.open}${item}${style.blue.close}`
        }
      })
      .join('')
  )
}

const printWarnings = (warnings: Warning[]) => {
  for (const warning of warnings) {
    const { path, message } = warning
    const formattedPath = formatPath(path)
    console.warn(
      `${style.red.open}Warning:${style.red.close} ${formattedPath}: ${style.red.open}${message}${style.red.close}`,
    )
  }
}

export { printWarnings }
