import style from 'ansi-styles'

import { Warning, Path } from './types'

const formatPath = (path: Path): string => {
  return (
    path
      .map((item, index) => {
        const isLast = (index === path.length - 1)

        if (typeof item === 'number') {
          const color = isLast ? style.greenBright : style.gray
          return `${style.gray.open}[${color.open}${item}${style.gray.open}]${style.gray.close}`
        } else {
          const color = isLast ? style.blueBright : style.gray
          return `${style.gray.open}.${color.open}${item}${color.close}`
        }
      })
      .join('')
  )
}

const printWarnings = (warnings: Warning[]) => {
  for (const warning of warnings) {
    const { path, message } = warning
    const formattedPath = formatPath(path)
    console.warn(`${style.red.open}Warning:${style.red.close} ${formattedPath} ${style.redBright.open}${message}${style.redBright.close}`)
  }
}

export {
  printWarnings
}
