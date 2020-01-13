import { Path, PathKey, Warning } from './types'

const isUndefined = (value: any) => typeof value === 'undefined'

interface GetOptions {
  quiet?: boolean,
}

class Prism<T = any> {
  public readonly path: Path
  public readonly value: T
  public readonly exists: boolean
  public readonly warnings: Warning[]

  private _child (value: any, path: Path) {
    return new Prism(value, [...this.path, ...path], this.warnings)
  }

  public constructor (value: T, path: Path = [], warnings: Warning[] = []) {
    this.exists = !isUndefined(value)
    this.path = path
    this.value = value
    this.warnings = warnings
  }

  public transform<C = unknown> (fn: (prism: Prism<T>) => C): Prism<C> {
    try {
      return this._child(fn(this), [])
    } catch (error) {
      this.warn(error.message)
      return this._child(undefined, [])
    }
  }

  public get<C = any> (key: PathKey, options: GetOptions = {}): Prism<C> {
    const { quiet } = options

    if (!this.exists) {
      if (!quiet) {
        this.warn(`value is undefined. Cannot get key: "${key}"`)
      }
      return this._child(undefined, [key])
    }

    if (this.value == null) {
      if (!quiet) {
        this.warn(`value is null. Cannot get key: "${key}"`)
      }
      return this._child(undefined, [key])
    }

    const nextValue = ((this.value as unknown) as Record<PathKey, C>)[key]

    if (!quiet && isUndefined(nextValue)) {
      this.warn(`value is undefined.`, [key])
    }

    return this._child(nextValue, [key])
  }

  public has (key: PathKey): boolean {
    return this.get(key, { quiet: true }).exists
  }

  public toArray (): Prism<T[keyof T]>[] {
    if (!Array.isArray(this.value)) {
      if (this.value != null) {
        this.warn('value is not an array, but was expected to be one')
      }
      return []
    }
    return this.value.map((item, key) => {
      return this._child(item, [key])
    })
  }

  public warn (message: string, path: Path = []) {
    this.warnings.push({ path: [...this.path, ...path], message })
  }
}

export default Prism
