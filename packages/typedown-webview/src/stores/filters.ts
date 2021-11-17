import { derived } from 'svelte/store'
import type { Readable } from 'svelte/store'
import type { DefinitionIdentifier } from 'typedown-shared'

import { definitions } from './definitions'
import { persistentWritable } from '../lib/persistentWritable'

const filterInitialState = ''

function createFilter() {
  const store = persistentWritable<string>('filter', filterInitialState)

  return {
    ...store,
    reset() {
      store.set(filterInitialState)
    },
  }
}

export const filter = createFilter()

export const isFiltering = derived(filter, ($filter) => $filter.length > 0)

export const results: Readable<DefinitionIdentifier[]> = derived(
  [isFiltering, filter, definitions],
  ([$isFiltering, $filter, $definitions]) => {
    if (!$isFiltering) {
      return []
    }

    const needle = new RegExp($filter, 'i')

    return $definitions.allIds.filter((id) => {
      const definition = $definitions.byId[id]

      if (!definition) {
        return false
      }

      return needle.test(definition.name)
    })
  }
)
