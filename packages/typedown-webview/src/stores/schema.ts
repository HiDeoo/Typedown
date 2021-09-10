import type { Schema } from 'typedown-shared'

import { persistentWritable } from '../lib/persistentWritable'

export const schema = persistentWritable<Schema | undefined>('schema', undefined)
