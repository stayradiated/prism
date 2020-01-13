import style from 'ansi-styles'

import { Warning, Path } from './types'

const formatPath = (path: Path): string => {
  return path
    .map((item, index) => {
      const isLast = index === path.length - 1

      if (typeof item === 'number') {
        const color = isLast ? style.green : style.gray
        return `${style.gray.open}[${color.open}${item}${style.gray.open}]${style.gray.close}`
      } else {
        const color = isLast ? style.blue : style.gray
        return `${style.gray.open}.${color.open}${item}${color.close}`
      }
    })
    .join('')
}

const printWarnings = (warnings: Warning[], root = 'root') => {
  for (const warning of warnings) {
    const { path, message } = warning
    const formattedPath = formatPath(path)
    console.warn(
      `${style.redBright.open}Warning:${style.redBright.close} ${style.blueBright.open}${root}${style.blueBright.close}${formattedPath} ${style.redBright.open}${message}${style.redBright.close}`,
    )
  }
}

export { printWarnings }
