import chalk from 'chalk'
import ErrorStackParser from 'error-stack-parser'

import type { Warning, Path } from './types.js'

/**
 * @ignore
 */
const formatPath = (path: Path): string =>
  path
    .map((item, index) => {
      const isLast = index === path.length - 1

      if (typeof item === 'number') {
        const color = isLast ? chalk.green : chalk.gray
        return `${chalk.gray('[')}${color(item)}${chalk.gray(']')}`
      }

      const color = isLast ? chalk.blue : chalk.gray
      return `${chalk.gray('.')}${color(item)}`
    })
    .join('')

/**
 * @ignore
 */
const formatSource = (error: Error): string => {
  const stackFrame = ErrorStackParser.parse(error).find((stackFrame) => {
    if (
      typeof stackFrame.fileName === 'string' &&
      stackFrame.fileName.includes('@zwolf/prism')
    ) {
      return false
    }

    return true
  })
  if (!stackFrame) {
    return 'Unknown source.'
  }

  const { fileName, lineNumber, columnNumber } = stackFrame
  return `${chalk.gray('at ')}${chalk.greenBright(fileName)}${chalk.gray(
    ':',
  )}${chalk.yellowBright(lineNumber)}${chalk.gray(':')}${chalk.blueBright(
    columnNumber,
  )}`
}

const printWarnings = (warnings: Warning[], root = 'root') => {
  for (const warning of warnings) {
    const { path, error } = warning

    const formattedPath = formatPath(path)
    const source = formatSource(error)

    console.warn(
      `${chalk.redBright('Warning:')} ${chalk.blueBright(
        root,
      )}${formattedPath} ${chalk.redBright(error.message)} ${source}`,
    )
  }
}

export { printWarnings }
