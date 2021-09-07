import { writable } from 'svelte/store'
import type { VSCodeMessageDefinitions } from 'typedown-messages'

function createDefinitions() {
  const { subscribe, update } = writable<DefinitionStore>()

  return {
    subscribe,
    setSchema: (schema: DefinitionStore['schema']) =>
      update((self) => {
        self.schema = schema
        return self
      }),
  }
}

export const definitions = createDefinitions()

interface DefinitionStore {
  schema: VSCodeMessageDefinitions['schema']
}
