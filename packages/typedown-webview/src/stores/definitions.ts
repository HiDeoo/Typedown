import type { Definition, DefinitionIdentifier } from 'typedown-shared'

import { persistentWritable } from '../lib/persistentWritable'

function createDefinitions() {
  const { persist, subscribe, update } = persistentWritable<Record<DefinitionIdentifier, Definition>>('definitions', {})

  return {
    persist,
    subscribe,
    toggle(definition: Definition) {
      update((currentValue) => {
        const id = definition.id
        const storeDefinition = currentValue[id]

        if (!storeDefinition) {
          currentValue[id] = definition
        } else {
          delete currentValue[id]
        }

        return currentValue
      })
    },
  }
}

export const definitions = createDefinitions()
