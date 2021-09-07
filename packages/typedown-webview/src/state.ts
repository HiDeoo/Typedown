import type { Schema } from 'typedown-shared'

export function getSchemaFromState(): Schema | undefined {
  return vscode.getState<State | undefined>()?.schema
}

export function setSchemaToState(schema: Schema): void {
  vscode.setState<State>({ schema })
}

interface State {
  schema: Schema
}
