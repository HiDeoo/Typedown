import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

import vscode from './vscode'

export function persistentWritable<T>(key: string, initialValue: T): PersistentWritable<T> {
  const store = writable<T>(initialValue)

  return {
    ...store,
    persist: () => {
      type MaybeState = { [key: string]: T }

      const state = vscode.getState<MaybeState>()
      const stateValue = state?.[key]

      if (stateValue) {
        store.set(stateValue)
      }

      store.subscribe((currentValue) => {
        const state = vscode.getState<MaybeState>()

        vscode.setState({ ...state, [key]: currentValue })
      })

      return typeof stateValue !== 'undefined'
    },
  }
}

type PersistentWritable<T> = Writable<T> & { persist: () => boolean }
