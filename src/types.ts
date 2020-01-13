export type PathKey = string | number
export type Path = PathKey[]

export interface Warning {
  path: Path,
  message: string,
}
