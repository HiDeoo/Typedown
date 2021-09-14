declare module 'gitignore-to-glob' {
  export default function gitignoreToGlob(pathToGitignore?: string, dirsToCheck?: string[]): string[]
}
