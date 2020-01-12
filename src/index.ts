type PathKey = string | number
type Path = PathKey[]

const formatPath = (path: Path): string => {
  return (
    'root' +
    path
      .map((item) => {
        if (typeof item === 'number') {
          return `[${item}]`
        } else {
          return `.${item}`
        }
      })
      .join('')
  )
}

const isUndefined = (value: any) => typeof value === 'undefined'

interface GetOptions {
  quiet?: boolean,
}

class Prism<T = any> {
  public readonly path: Path
  public readonly value: T
  public readonly exists: boolean
  public readonly warnings: string[]

  private _child (value: any, path: Path) {
    return new Prism(value, [...this.path, ...path], this.warnings)
  }

  public constructor (value: T, path: Path = [], warnings: string[] = []) {
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

  public transformValue<C = unknown> (fn: (value: T) => C): Prism<C> {
    return this.transform((self) => fn(self.value))
  }

  public get<C = any> (key: PathKey, options: GetOptions = {}): Prism<C> {
    const { quiet } = options

    if (!this.exists) {
      if (!quiet) {
        this.warn(`Value is undefined. Cannot get key: "${key}"`)
      }
      return this._child(undefined, [key])
    }

    if (this.value == null) {
      if (!quiet) {
        this.warn(`Value is null. Cannot get key: "${key}"`)
      }
      return this._child(undefined, [key])
    }

    const nextValue = ((this.value as unknown) as Record<PathKey, C>)[key]

    if (!quiet && isUndefined(nextValue)) {
      this.warn(`Value is undefined.`, [key])
    }

    return this._child(nextValue, [key])
  }

  public has (key: PathKey): boolean {
    return this.get(key, { quiet: true }).exists
  }

  public toArray (): Prism<T[keyof T]>[] {
    if (!Array.isArray(this.value)) {
      this.warn('not an array')
      return []
    }
    return this.value.map((item, key) => {
      return this._child(item, [key])
    })
  }

  public warn (message: string, path: Path = []) {
    this.warnings.push(`${formatPath([...this.path, ...path])}: ${message}`)
  }
}

export default Prism
