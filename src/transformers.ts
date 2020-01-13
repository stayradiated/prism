import Prism from './index'

export type Transformer<C, T> = (prism: Prism<T>) => C

const asValue = <C, T>(fn: (value: T) => C): Transformer<C, T> => {
  return (prism) => fn(prism.value)
}

const defaultTo = <T>(defaultValue: T): Transformer<T, T> => {
  return (prism) => {
    if (prism.exists) {
      return prism.value
    }
    return defaultValue
  }
}

export { asValue, defaultTo }
