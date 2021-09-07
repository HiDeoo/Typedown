import { writable } from 'svelte/store'
import type { VSCodeMessageDefinitions } from 'typedown-messages'

function createDefinitions() {
  const { subscribe, update } = writable<SchemaWithDefinitions | undefined>(undefined)

  return {
    subscribe,
    setSchema: (schema: Schema) =>
      update(() => {
        return isSchemaWithDefinitions(schema) ? schema : undefined
      }),
    toggle: (identifier: string) =>
      update((self) => {
        const definition = self?.definitions[identifier]

        if (definition) {
          definition.selected = definition.selected ? false : true
        }

        return self
      }),
  }
}

export const definitions = createDefinitions()

function isSchemaWithDefinitions(schema: Schema): schema is SchemaWithDefinitions {
  return typeof schema.definitions !== 'undefined'
}

type Schema = VSCodeMessageDefinitions['schema']
type Definitions = Exclude<Exclude<Schema, undefined>['definitions'], undefined>
export type Definition = Definitions[keyof Definitions]

interface SchemaWithDefinitions extends Schema {
  definitions: {
    [key: string]: Definition & { selected?: boolean }
  }
}
