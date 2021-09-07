import { get, writable } from 'svelte/store'
import type { VSCodeMessageDefinitions } from 'typedown-messages'

function createDefinitions() {
  const definitions = writable<SchemaWithDefinitions | undefined>(undefined)

  return {
    subscribe: definitions.subscribe,
    setSchema: (schema: Schema) =>
      definitions.update(() => {
        return isSchemaWithDefinitions(schema) ? schema : undefined
      }),
    toggle: (identifier: string) =>
      definitions.update((self) => {
        const definition = self?.definitions[identifier]

        if (definition) {
          definition.selected = definition.selected ? false : true
        }

        return self
      }),
    export: (): Definitions => {
      const schema = get(definitions)

      if (!schema) {
        return {}
      }

      return Object.entries(schema.definitions).reduce<Definitions>((acc, [identifier, definition]) => {
        if (definition.selected) {
          acc[identifier] = definition
        }

        return acc
      }, {})
    },
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
