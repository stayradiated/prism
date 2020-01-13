import chalk from 'chalk'
import ErrorStackParser, { StackFrame } from 'error-stack-parser'

import { Warning, Path } from './types'

const formatPath = (path: Path): string => {
  return path
    .map((item, index) => {
      const isLast = index === path.length - 1

      if (typeof item === 'number') {
        const color = isLast ? chalk.green : chalk.gray
        return `${chalk.gray('[')}${color(item)}${chalk.gray(']')}`
      } else {
        const color = isLast ? chalk.blue : chalk.gray
        return `${chalk.gray('.')}${color(item)}`
      }
    })
    .join('')
}

const formatSource = (stackFrame: StackFrame) => {
  const { fileName, lineNumber, columnNumber } = stackFrame
  return `${chalk.gray('at ')}${chalk.greenBright(fileName)}${chalk.gray(':')}${chalk.yellowBright(lineNumber)}${chalk.gray(':')}${chalk.blueBright(columnNumber)}`
}

const printWarnings = (warnings: Warning[], root = 'root') => {
  for (const warning of warnings) {
    const { path, error } = warning

    const formattedPath = formatPath(path)

    const stackFrames = ErrorStackParser.parse(error)
    const source = formatSource(stackFrames[0])

    console.warn(
      `${chalk.redBright('Warning:')} ${chalk.blueBright(root)}${formattedPath} ${chalk.redBright(error)} ${source}`,
    )
  }
}

export { printWarnings }
