import { persistentWritable } from '../lib/persistentWritable'

const scrollYInitialState = 0

function createScrollY() {
  const store = persistentWritable<number>('scrollY', scrollYInitialState)

  return {
    ...store,
    reset() {
      store.set(scrollYInitialState)
    },
  }
}

export const scrollY = createScrollY()
