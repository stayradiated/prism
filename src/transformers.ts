import Prism from './index.js'

export type Transformer<C, T> = (prism: Prism<T>) => C

const asValue =
  <C, T>(fn: (value: T | undefined) => C): Transformer<C, T> =>
  (prism) =>
    fn(prism.value)

const defaultTo =
  <V>(defaultValue: V): Transformer<V, V> =>
  (prism) => {
    if (prism.exists) {
      return prism.value!
    }

    return defaultValue
  }

export { asValue, defaultTo }
