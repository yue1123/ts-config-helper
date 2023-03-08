export function parsePath(path: string) {
  return path.replace('#/', '').split('/')
}
