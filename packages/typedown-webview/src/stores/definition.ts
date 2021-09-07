import { get, writable } from 'svelte/store'
import type { Definitions, Schema } from 'typedown-shared'

import { setSchemaToState } from '../state'

function createDefinitions() {
  const definitions = writable<Schema | undefined>(undefined)

  return {
    subscribe: definitions.subscribe,
    setSchema: (schema: Schema) =>
      definitions.update(() => {
        setSchemaToState(schema)

        return schema
      }),
    toggle: (identifier: string) =>
      definitions.update((schema) => {
        const definition = schema?.definitions[identifier]

        if (definition) {
          definition.selected = definition.selected ? false : true
        }

        if (schema) {
          setSchemaToState(schema)
        }

        return schema
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
