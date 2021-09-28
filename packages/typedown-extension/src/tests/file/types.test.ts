import { assertMarkdownDefinitions, fileToMd, withFixture } from '../utils'

const fixture = 'file/src/types.ts'

describe('types', () => {
  describe('type aliases', () => {
    it('should export a type alias of intrinsic type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['IntrinsicType'])

        return assertMarkdownDefinitions(markdown, [{ name: 'IntrinsicType', type: 'string' }])
      }))

    it('should export a type alias of array type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['ArrayType'])

        return assertMarkdownDefinitions(markdown, [{ name: 'ArrayType', type: 'number[]' }])
      }))

    it('should export a type alias of literal type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['LiteralType'])

        return assertMarkdownDefinitions(markdown, [{ name: 'LiteralType', type: "'test'" }])
      }))

    it('should export a type alias of intersection type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['IntersectionType'])

        return assertMarkdownDefinitions(markdown, [{ name: 'IntersectionType', type: 'IntrinsicType & LiteralType' }])
      }))

    it('should export a type alias of tuple type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['TupleType'])

        return assertMarkdownDefinitions(markdown, [{ name: 'TupleType', type: '[boolean, ...number[]]' }])
      }))

    it('should export a type alias of union type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['UnionType'])

        return assertMarkdownDefinitions(markdown, [{ name: 'UnionType', type: 'string | TestTypeA' }])
      }))

    it('should export a type alias of union array type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['UnionArrayType'])

        return assertMarkdownDefinitions(markdown, [{ name: 'UnionArrayType', type: '(number | string)[]' }])
      }))

    it('should export a type alias of function type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['FunctionType'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'FunctionType',
            type: '(a: (a1: string, a2?: number) => boolean) => [boolean, string]',
          },
        ])
      }))

    it('should export a type alias with the readonly keyword for array type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['ReadonlyArrayType'])

        return assertMarkdownDefinitions(markdown, [{ name: 'ReadonlyArrayType', type: 'readonly string[]' }])
      }))

    it('should export a type alias with the readonly keyword for tuple type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['ReadonlyTupleType'])

        return assertMarkdownDefinitions(markdown, [{ name: 'ReadonlyTupleType', type: 'readonly [boolean, string]' }])
      }))

    it('should export a type alias with generics', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['GenericType<T, U>'])

        return assertMarkdownDefinitions(markdown, [{ name: 'GenericType<T, U>', type: '(...a: U[]) => U | [T]' }])
      }))

    it('should export a type alias with generic constraints', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['GenericConstraintsType<T extends string, U extends keyof TestTypeB>'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'GenericConstraintsType<T extends string, U extends keyof TestTypeB>',
            type: '(a: T) => U[]',
          },
        ])
      }))

    it('should export a type alias with a type operator type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['TypeOperatorType<T extends keyof TestTypeA>'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'TypeOperatorType<T extends keyof TestTypeA>',
            type: '[T] & keyof TestTypeA',
          },
        ])
      }))

    it('should export a type alias with a reference type argument', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['ReferenceTypeArgumentType'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'ReferenceTypeArgumentType',
            type: "Partial<Omit<TestTypeA, 'a' | 'b'>>",
          },
        ])
      }))

    it('should export a type alias with a reference type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['ReferenceType'])

        return assertMarkdownDefinitions(markdown, [{ name: 'ReferenceType', type: 'TestTypeA' }])
      }))

    it('should export a type alias with a description', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['DescriptionType'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'DescriptionType',
            description: 'Description',
            type: 'number[]',
          },
        ])
      }))

    it('should export a type alias with a conditional type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['ConditionalType<T>'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'ConditionalType<T>',
            type: 'T extends PromiseLike<infer U> ? ConditionalType<U> : T',
          },
        ])
      }))

    it('should export a type alias with a predicate type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['PredicateType'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'PredicateType',
            type: '(a: string | number) => a is string',
          },
        ])
      }))

    it('should export a type alias with an asserts predicate type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['AssertsPredicateType'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'AssertsPredicateType',
            type: '(a: string | number) => asserts a is string',
          },
        ])
      }))

    it('should export a type alias with a query type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['QueryType'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'QueryType',
            type: 'typeof testConstA',
          },
        ])
      }))
  })

  describe('object type aliases', () => {
    it('should export an object type alias of intrinsic types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithIntrinsicTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithIntrinsicTypes',
            children: [
              { name: 'a', type: 'boolean' },
              { name: 'b', type: 'string' },
              { name: 'c', type: 'number' },
            ],
          },
        ])
      }))

    it('should export an object type alias of array types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithArrayTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithArrayTypes',
            children: [
              { name: 'a', type: 'boolean[]' },
              { name: 'b', type: 'string[]' },
              { name: 'c', type: 'number[]' },
            ],
          },
        ])
      }))

    it('should export an object type alias of literal types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithLiteralTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithLiteralTypes',
            children: [
              { name: 'a', type: 'false' },
              { name: 'b', type: "'test'" },
              { name: 'c', type: 'null' },
              { name: 'd', type: '4' },
            ],
          },
        ])
      }))

    it('should export an object type alias of intersection types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithIntersectionTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithIntersectionTypes',
            children: [
              { name: 'a', type: 'WithIntrinsicTypes & WithArrayTypes' },
              { name: 'b', type: 'TestTypeA & TestTypeB' },
            ],
          },
        ])
      }))

    it('should export an object type alias of tuple types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithTupleTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithTupleTypes',
            children: [
              { name: 'a', type: '[boolean, number]' },
              { name: 'b', type: '[number, string?]' },
              { name: 'c', type: '[boolean, ...number[]]' },
            ],
          },
        ])
      }))

    it('should export an object type alias of union types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithUnionTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithUnionTypes',
            children: [
              { name: 'a', type: 'string | number' },
              { name: 'b', type: 'string | TestTypeA' },
            ],
          },
        ])
      }))

    it('should export an object type alias of union array types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithUnionArrayTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithUnionArrayTypes',
            children: [
              { name: 'a', type: '(number | string)[]' },
              { name: 'b', type: 'boolean | number[]' },
            ],
          },
        ])
      }))

    it('should export an object type alias of optional types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithOptionalTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithOptionalTypes',
            children: [
              { name: 'a', type: 'number', optional: true },
              { name: 'b', type: 'string' },
              { name: 'c', type: 'boolean[]', optional: true },
            ],
          },
        ])
      }))

    it('should export an object type alias with property default values', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithPropertyDefaultValues'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithPropertyDefaultValues',
            children: [
              { name: 'a', type: 'number', optional: true, defaultValue: '8080' },
              { name: 'b', type: 'string', optional: true, defaultValue: 'development' },
            ],
          },
        ])
      }))

    it('should export an object type alias with property descriptions', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithPropertyDescriptions'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithPropertyDescriptions',
            children: [
              { name: 'a', type: 'number[]', description: 'Description A' },
              { name: 'b', type: 'string' },
              { name: 'c', type: 'boolean', description: 'Description C multiline.' },
              { name: 'd', type: 'boolean[]', description: 'Description D' },
            ],
          },
        ])
      }))

    it('should export an object type alias of function types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithFunctionTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithFunctionTypes',
            children: [
              { name: 'a', type: '() => boolean' },
              { name: 'b', type: '(b1: number, b2?: string) => null' },
              { name: 'c', type: '(...c1: number[]) => string' },
              { name: 'd', type: '(d1: (d1a: string, d1b?: number) => boolean) => [boolean, string]' },
              { name: 'e', type: '(e1: string) => [number, boolean]' },
            ],
          },
        ])
      }))

    it('should export an object type alias without the readonly property keyword', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithReadOnlyTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithReadOnlyTypes',
            children: [
              { name: 'a', type: 'number' },
              { name: 'b', type: 'boolean' },
              { name: 'c', type: '() => boolean' },
            ],
          },
        ])
      }))

    it('should export an object type alias with the readonly keyword for array and tuple types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithReadonlyTupleAndArrayTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithReadonlyTupleAndArrayTypes',
            children: [
              { name: 'a', type: 'readonly [number, boolean]' },
              { name: 'b', type: 'readonly number[]' },
            ],
          },
        ])
      }))

    it('should export an object type alias with generics', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithGenerics<T, U>'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithGenerics<T, U>',
            children: [
              { name: 'a', type: 'T[]' },
              { name: 'b', type: '(...b1: U[]) => U | [T]' },
            ],
          },
        ])
      }))

    it('should export an object type alias with generic constraints', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithGenericConstraints<T extends string, U extends keyof TestTypeB>'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithGenericConstraints<T extends string, U extends keyof TestTypeB>',
            children: [
              { name: 'a', type: '(b1: T) => U[]' },
              { name: 'b', type: 'U | T' },
            ],
          },
        ])
      }))

    it('should export an object type alias with type operator types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithTypeOperatorTypes<T extends keyof TestTypeA>'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithTypeOperatorTypes<T extends keyof TestTypeA>',
            children: [
              { name: 'a', type: 'T[]' },
              { name: 'b', type: 'keyof TestTypeA' },
            ],
          },
        ])
      }))

    it('should export an object type alias with reference type arguments', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithReferenceTypeArguments'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithReferenceTypeArguments',
            children: [
              { name: 'a', type: 'Record<string, TestTypeA>' },
              { name: 'b', type: "Omit<TestTypeB, 'c'>" },
              { name: 'c', type: "Partial<Omit<TestTypeA, 'a' | 'b'>>" },
            ],
          },
        ])
      }))

    it('should export an object type alias with reference types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithReferenceTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithReferenceTypes',
            children: [
              { name: 'a', type: 'TestTypeA' },
              { name: 'b', type: 'TestTypeB' },
              { name: 'c', type: 'TestTypeC' },
              { name: 'd', type: 'TestTypeD', optional: true },
            ],
          },
        ])
      }))

    it('should export an object type alias with predicate types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithPredicateTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithPredicateTypes',
            children: [
              { name: 'a', type: '(a1: string | number) => a1 is string' },
              { name: 'b', type: '(b1: number[] | boolean[]) => asserts b1 is number[]' },
            ],
          },
        ])
      }))

    it('should export an object type alias with query types', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithQueryTypes'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithQueryTypes',
            children: [
              { name: 'a', type: '(a1: string) => number' },
              { name: 'b', type: 'typeof testConstA' },
            ],
          },
        ])
      }))

    it('should export an object type alias with a description', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithDescriptions'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithDescriptions',
            description: 'Description',
            children: [
              { name: 'a', type: 'boolean' },
              { name: 'b', type: 'string' },
              { name: 'c', type: 'number[]', description: 'Description C' },
            ],
          },
        ])
      }))
  })

  describe('mapped types', () => {
    it('should export a basic mapped type', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithMappedType<T>'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithMappedType<T>',
            children: [{ name: '[key in keyof T]', type: 'number | boolean' }],
          },
        ])
      }))

    it('should export a mapped type adding the optional modifier', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithMappedTypeOptionalModifier<T>'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithMappedTypeOptionalModifier<T>',
            children: [{ name: '[key in keyof T]', type: 'boolean', optional: true }],
          },
        ])
      }))

    it('should export a mapped type without the readonly modifier', () =>
      withFixture(fixture, async () => {
        const markdown = await fileToMd(['WithMappedTypeReadonlyModifier<T>'])

        return assertMarkdownDefinitions(markdown, [
          {
            name: 'WithMappedTypeReadonlyModifier<T>',
            children: [{ name: '[key in keyof T]', type: 'number[]' }],
          },
        ])
      }))
  })
})
