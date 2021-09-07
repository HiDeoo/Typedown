import { writable } from 'svelte/store'
import type { VSCodeMessageDefinitions } from 'typedown-messages'

function createDefinitions() {
  const { subscribe, update } = writable<DefinitionStore>({ schema: undefined })

  return {
    subscribe,
    setSchema: (schema: Schema) =>
      update((self) => {
        if (isSchemaWithDefinitions(schema)) {
          self.schema = schema
        }

        return self
      }),
  }
}

export const definitions = createDefinitions()

function isSchemaWithDefinitions(schema: Schema): schema is SchemaWithDefinitions {
  return typeof schema.$ref !== 'undefined' && typeof schema.definitions !== 'undefined'
}

interface DefinitionStore {
  schema?: SchemaWithDefinitions
}

type Schema = VSCodeMessageDefinitions['schema']
type Definitions = Exclude<Exclude<Schema, undefined>['definitions'], undefined>
export type Definition = Definitions[keyof Definitions]

interface SchemaWithDefinitions extends Schema {
  $ref: string
  definitions: Definitions
}
