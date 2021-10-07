import { get } from 'svelte/store'
import type { Definition, DefinitionIdentifier, Definitions } from 'typedown-shared'

import { persistentWritable } from '../lib/persistentWritable'

const initialState: DefinitionsStore = { allIds: [], byId: {} }

function createDefinitions() {
  const store = persistentWritable<DefinitionsStore>('definitions', initialState)

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
    reset() {
      store.set(initialState)
    },
    toggle(identifier: DefinitionIdentifier) {
      store.update((currentValue) => {
        const definition = currentValue.byId[identifier]

        if (definition) {
          definition.exported = definition.exported ? false : true
        }

        return currentValue
      })
    },
    selectAll(selected: boolean) {
      store.update((currentValue) => {
        currentValue.allIds.forEach((identifier) => {
          const definition = currentValue.byId[identifier]

          if (definition) {
            definition.exported = selected
          }
        })

        return currentValue
      })
    },
    getExportedDefinitions(): Definitions {
      const definitions = get(store)

      const exported = definitions.allIds.reduce<Definitions>((acc, identifier) => {
        const definition = definitions.byId[identifier]

        if (definition && definition.exported) {
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
  byId: Record<DefinitionIdentifier, Definition>
}
