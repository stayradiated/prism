import { isUndefined } from './is-undefined.js'

import type { Path, PathKey, Warning } from './types.js'

class Prism<T = any> {
  public readonly path: Path
  public readonly value: T
  public readonly exists: boolean
  public readonly warnings: Warning[]

  public constructor(value: T, path: Path = [], warnings: Warning[] = []) {
    this.exists = !isUndefined(value)
    this.path = path
    this.value = value
    this.warnings = warnings
  }

  public transform<C = unknown>(
    fn: (prism: Prism<T>) => C,
  ): Prism<C | undefined> {
    try {
      return this._child<C>(fn(this), [])
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.warn(error)
      }

      return this._child(undefined, [])
    }
  }

  public get<C = any>(
    key: PathKey,
    options: { quiet?: boolean } = {},
  ): Prism<C | undefined> {
    const { quiet } = options

    if (!this.exists) {
      if (!quiet) {
        this.warn(new Error(`value is undefined. Cannot get key: "${key}"`))
      }

      return this._child(undefined, [key])
    }

    if (this.value === null || this.value === undefined) {
      if (!quiet) {
        this.warn(new Error(`value is null. Cannot get key: "${key}"`))
      }

      return this._child(undefined, [key])
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

  public toArray(): Array<Prism<T extends (infer U)[] ? U : never>> {
    if (!Array.isArray(this.value)) {
      if (this.value !== null && this.value !== undefined) {
        this.warn(
          new Error('value is not an array, but was expected to be one'),
        )
      }

      return []
    }

    return this.value.map((item, key) => this._child<T extends (infer U)[] ? U : never>(item, [key]))
  }

  public warn(error: Error, path: Path = []) {
    this.warnings.push({
      error,
      path: [...this.path, ...path],
    })
  }

  private _child<T>(value: T, path: Path): Prism<T> {
    return new Prism(value, [...this.path, ...path], this.warnings)
  }
}

export { Prism }
