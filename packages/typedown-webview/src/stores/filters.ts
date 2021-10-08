import { derived, Readable, writable } from 'svelte/store'
import type { DefinitionIdentifier } from 'typedown-shared'

import { definitions } from './definitions'

export const filter = writable('')

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
