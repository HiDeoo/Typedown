declare module 'gitignore-to-glob' {
  export default function gitignoreToGlob(pathToGitignore?: string, dirsToCheck?: string[]): string[]
  export default function gitignoreToGlob(
    pathToGitignore?: string,
    options?: { dirsToCheck?: string[]; string?: boolean }
  ): string[]
}
