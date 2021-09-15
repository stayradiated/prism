import Chalk from 'chalk'
import ErrorStackParser from 'error-stack-parser'

import type { Warning, Path } from './types.js'

const chalkNoColor = new Chalk.Instance({ level: 0 })
const chalkColor = new Chalk.Instance({ level: 1 })

/**
 * @ignore
 */
const formatPath = (path: Path, chalk: Chalk.Chalk): string =>
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
const formatSource = (error: Error, chalk: Chalk.Chalk): string => {
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

const formatWarnings = (warnings: Warning[], root = 'root', color: boolean = false): string => {
  const chalk = color ? chalkColor : chalkNoColor
  return warnings
    .map((warning) => {
      const { path, error } = warning

      const formattedPath = formatPath(path, chalk)
      const source = formatSource(error, chalk)

      return `${chalk.redBright('Warning:')} ${chalk.blueBright(
        root,
      )}${formattedPath} ${chalk.redBright(error.message)} ${source}`
    })
    .join('\n')
}

const printWarnings = (warnings: Warning[], root?: string): void => {
  console.warn(formatWarnings(warnings, root, true))
}

export { formatWarnings, printWarnings }
