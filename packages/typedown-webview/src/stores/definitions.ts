import { get } from 'svelte/store'
import type { Definition, DefinitionIdentifier, Definitions } from 'typedown-shared'

import { persistentWritable } from '../lib/persistentWritable'

function createDefinitions() {
  const store = persistentWritable<DefinitionsStore>('definitions', { allIds: [], byId: {} })

  return {
    persist: store.persist,
    subscribe: store.subscribe,
    set(definitions: Definitions) {
      const allIds: DefinitionsStore['allIds'] = []
      const byId: DefinitionsStore['byId'] = {}

      definitions.forEach((definition) => {
        allIds.push(definition.id)
        byId[definition.id] = definition
      })

      store.set({
        allIds,
        byId,
      })
    },
    toggle(identifier: DefinitionIdentifier) {
      store.update((currentValue) => {
        const definition = currentValue.byId[identifier]

        if (definition) {
          definition._exported = definition._exported ? false : true
        }

        return currentValue
      })
    },
    getExportedDefinitions(): Definitions {
      const definitions = get(store)

      const exported = definitions.allIds.reduce<Definitions>((acc, identifier) => {
        const definition = definitions.byId[identifier]

        if (definition && definition._exported) {
          acc.push(definition)
        }

        return acc
      }, [])

      return exported
    },
  }
}

export const definitions = createDefinitions()

interface DefinitionsStore {
  allIds: DefinitionIdentifier[]
  byId: Record<DefinitionIdentifier, Definition & { _exported?: boolean }>
}
