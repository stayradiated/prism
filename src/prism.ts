import { isUndefined } from './is-undefined.js'

import type { Path, PathKey, Warning } from './types.js'

class Prism<T = any> {
  public readonly path: Path
  public readonly value: T | undefined
  public readonly exists: boolean
  public readonly warnings: Warning[]

  public constructor(
    value: T | undefined,
    path: Path = [],
    warnings: Warning[] = [],
  ) {
    this.exists = !isUndefined(value)
    this.path = path
    this.value = value
    this.warnings = warnings
  }

  public transform<C = unknown>(fn: (prism: Prism<T>) => C): Prism<C> {
    try {
      return this._child<C>(fn(this), [])
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.warn(error)
      }

      return this._child<C>(undefined, [])
    }
  }

  public get<C = any>(
    key: PathKey,
    options: { quiet?: boolean } = {},
  ): Prism<C> {
    const { quiet } = options

    if (!this.exists) {
      if (!quiet) {
        this.warn(new Error(`value is undefined. Cannot get key: "${key}"`))
      }

      return this._child<C>(undefined, [key])
    }

    if (this.value === null || this.value === undefined) {
      if (!quiet) {
        this.warn(new Error(`value is null. Cannot get key: "${key}"`))
      }

      return this._child<C>(undefined, [key])
    }

    const nextValue = (this.value as unknown as Record<PathKey, C>)[key]

    if (!quiet && isUndefined(nextValue)) {
      this.warn(new Error(`value is undefined.`), [key])
    }

    return this._child(nextValue, [key])
  }

  public has(key: PathKey): boolean {
    return this.get(key, { quiet: true }).exists
  }

  public toArray(): Array<Prism<T[keyof T]>> {
    if (!Array.isArray(this.value)) {
      if (this.value !== null && this.value !== undefined) {
        this.warn(
          new Error('value is not an array, but was expected to be one'),
        )
      }

      return []
    }

    return this.value.map((item, key) => this._child<T[keyof T]>(item, [key]))
  }

  public warn(error: Error, path: Path = []) {
    this.warnings.push({
      error,
      path: [...this.path, ...path],
    })
  }

  private _child<T>(value: T | undefined, path: Path): Prism<T> {
    return new Prism(value, [...this.path, ...path], this.warnings)
  }
}

export { Prism }
