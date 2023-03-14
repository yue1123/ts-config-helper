export function parsePath(path: string, splitter: string = '.') {
  return path.replace('#/', '').split(splitter)
}
