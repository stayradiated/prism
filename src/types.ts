export type PathKey = string | number
export type Path = PathKey[]

export interface Warning {
  error: Error,
  path: Path,
}
