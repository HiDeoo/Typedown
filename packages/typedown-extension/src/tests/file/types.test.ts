import type { Definitions } from 'typedown-shared'
import { assertMarkdownDefinitions, fileToMd, getDefinitionsFromFixture } from '../utils'

describe('types', () => {
  let definitions: Definitions = []

  before(async () => {
    definitions = await getDefinitionsFromFixture('file/src/types.ts', fileToMd)
  })

  describe('type aliases', () => {
    it('should export a type alias of intrinsic type', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'IntrinsicType', type: 'string' }]))

    it('should export a type alias of array type', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'ArrayType', type: 'number[]' }]))

    it('should export a type alias of literal type', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'LiteralType', type: "'test'" }]))

    it('should export a type alias of intersection type', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'IntersectionType', type: 'IntrinsicType & LiteralType' }]))

    it('should export a type alias of tuple type', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'TupleType', type: '[boolean, ...number[]]' }]))

    it('should export a type alias of union type', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'UnionType', type: 'string | TestTypeA' }]))

    it('should export a type alias of union array type', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'UnionArrayType', type: '(number | string)[]' }]))

    it('should export a type alias of function type', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'FunctionType',
          type: '(a: (a1: string, a2?: number) => boolean) => [boolean, string]',
        },
      ]))

    it('should export a type alias with the readonly keyword for array type', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'ReadonlyArrayType', type: 'readonly string[]' }]))

    it('should export a type alias with the readonly keyword for tuple type', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'ReadonlyTupleType', type: 'readonly [boolean, string]' }]))

    it('should export a type alias with generics', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'GenericType<T, U>', type: '(...a: U[]) => U | [T]' }]))

    it('should export a type alias with generic constraints', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'GenericConstraintsType<T extends string, U extends keyof TestTypeB>',
          type: '(a: T) => U[]',
        },
      ]))

    it('should export a type alias of type operator type', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'TypeOperatorType<T extends keyof TestTypeA>',
          type: '[T] & keyof TestTypeA',
        },
      ]))

    it('should export a type alias of reference type argument', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'ReferenceTypeArgumentType',
          type: "Partial<Omit<TestTypeA, 'a' | 'b'>>",
        },
      ]))

    it('should export a type alias of reference type', () =>
      assertMarkdownDefinitions(definitions, [{ name: 'ReferenceType', type: 'TestTypeA' }]))

    it('should export a type alias with a description', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'DescriptionType',
          description: 'Description',
          type: 'number[]',
        },
      ]))

    it('should export a type alias with a description tag', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'DescriptionTagType',
          description: 'Description',
          type: 'boolean',
        },
      ]))

    it('should export a type alias of conditional type', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'ConditionalType<T>',
          type: 'T extends PromiseLike<infer U> ? ConditionalType<U> : T',
        },
      ]))

    it('should export a type alias of predicate type', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'PredicateType',
          type: '(a: string | number) => a is string',
        },
      ]))

    it('should export a type alias of asserts predicate type', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'AssertsPredicateType',
          type: '(a: string | number) => asserts a is string',
        },
      ]))

    it('should export a type alias of query type', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'QueryType',
          type: 'typeof testConstA',
        },
      ]))

    it('should export a type alias of intersection type with object literals', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'ObjectLiteralIntersection',
          type: '{ a1: string; a2?: number } & { b1: boolean }',
        },
      ]))

    it('should export a type alias of union type with object literals', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'ObjectLiteralUnion',
          type: '{ a1: string; a2?: number } | { b1: boolean }',
        },
      ]))

    it('should export a type alias of template literal type', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'TemplateLiteralType',
          type: '`Hello ${LiteralType}`',
        },
      ]))

    it('should export a type alias of template literal union type', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'TemplateLiteralUnionType',
          type: '`Test${TemplateLiteralHeads | TemplateLiteralTails}`',
        },
      ]))
  })

  describe('object type aliases', () => {
    it('should export an object type alias with intrinsic types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithIntrinsicTypes',
          children: [
            { name: 'a', type: 'boolean' },
            { name: 'b', type: 'string' },
            { name: 'c', type: 'number' },
          ],
        },
      ]))

    it('should export an object type alias with array types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithArrayTypes',
          children: [
            { name: 'a', type: 'boolean[]' },
            { name: 'b', type: 'string[]' },
            { name: 'c', type: 'number[]' },
          ],
        },
      ]))

    it('should export an object type alias with literal types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithLiteralTypes',
          children: [
            { name: 'a', type: 'false' },
            { name: 'b', type: "'test'" },
            { name: 'c', type: 'null' },
            { name: 'd', type: '4' },
          ],
        },
      ]))

    it('should export an object type alias with intersection types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithIntersectionTypes',
          children: [
            { name: 'a', type: 'WithIntrinsicTypes & WithArrayTypes' },
            { name: 'b', type: 'TestTypeA & TestTypeB' },
            { name: 'c', type: '{ a: string; b?: boolean } & TestTypeB' },
          ],
        },
      ]))

    it('should export an object type alias with tuple types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithTupleTypes',
          children: [
            { name: 'a', type: '[boolean, number]' },
            { name: 'b', type: '[number, string?]' },
            { name: 'c', type: '[boolean, ...number[]]' },
          ],
        },
      ]))

    it('should export an object type alias with union types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithUnionTypes',
          children: [
            { name: 'a', type: 'string | number' },
            { name: 'b', type: 'string | TestTypeA' },
            { name: 'c', type: '{ a: string; b?: boolean } | TestTypeB' },
          ],
        },
      ]))

    it('should export an object type alias with union array types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithUnionArrayTypes',
          children: [
            { name: 'a', type: '(number | string)[]' },
            { name: 'b', type: 'boolean | number[]' },
          ],
        },
      ]))

    it('should export an object type alias with optional types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithOptionalTypes',
          children: [
            { name: 'a', type: 'number', optional: true },
            { name: 'b', type: 'string' },
            { name: 'c', type: 'boolean[]', optional: true },
          ],
        },
      ]))

    it('should export an object type alias with property default values', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithPropertyDefaultValues',
          children: [
            { name: 'a', type: 'number', optional: true, defaultValue: '8080' },
            { name: 'b', type: 'string', optional: true, defaultValue: 'development' },
          ],
        },
      ]))

    it('should export an object type alias with property descriptions', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithPropertyDescriptions',
          children: [
            { name: 'a', type: 'number[]', description: 'Description A' },
            { name: 'b', type: 'string' },
            { name: 'c', type: 'boolean', description: 'Description C1 multiline. Description C2' },
            { name: 'd', type: 'boolean[]', description: 'Description D' },
            { name: 'e', type: 'number', description: 'Description E' },
          ],
        },
      ]))

    it('should export an object type alias with function types', () =>
      assertMarkdownDefinitions(definitions, [
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
      ]))

    it('should export an object type alias without the readonly property keyword', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithReadOnlyTypes',
          children: [
            { name: 'a', type: 'number' },
            { name: 'b', type: 'boolean' },
            { name: 'c', type: '() => boolean' },
          ],
        },
      ]))

    it('should export an object type alias with the readonly keyword for array and tuple types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithReadonlyTupleAndArrayTypes',
          children: [
            { name: 'a', type: 'readonly [number, boolean]' },
            { name: 'b', type: 'readonly number[]' },
          ],
        },
      ]))

    it('should export an object type alias with generics', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithGenerics<T, U>',
          children: [
            { name: 'a', type: 'T[]' },
            { name: 'b', type: '(...b1: U[]) => U | [T]' },
          ],
        },
      ]))

    it('should export an object type alias with generic constraints', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithGenericConstraints<T extends string, U extends keyof TestTypeB>',
          children: [
            { name: 'a', type: '(b1: T) => U[]' },
            { name: 'b', type: 'U | T' },
          ],
        },
      ]))

    it('should export an object type alias with type operator types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithTypeOperatorTypes<T extends keyof TestTypeA>',
          children: [
            { name: 'a', type: 'T[]' },
            { name: 'b', type: 'keyof TestTypeA' },
          ],
        },
      ]))

    it('should export an object type alias with reference type arguments', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithReferenceTypeArguments',
          children: [
            { name: 'a', type: 'Record<string, TestTypeA>' },
            { name: 'b', type: "Omit<TestTypeB, 'c'>" },
            { name: 'c', type: "Partial<Omit<TestTypeA, 'a' | 'b'>>" },
          ],
        },
      ]))

    it('should export an object type alias with reference types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithReferenceTypes',
          children: [
            { name: 'a', type: 'TestTypeA' },
            { name: 'b', type: 'TestTypeB' },
            { name: 'c', type: 'TestTypeC' },
            { name: 'd', type: 'TestTypeD', optional: true },
          ],
        },
      ]))

    it('should export an object type alias with predicate types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithPredicateTypes',
          children: [
            { name: 'a', type: '(a1: string | number) => a1 is string' },
            { name: 'b', type: '(b1: number[] | boolean[]) => asserts b1 is number[]' },
          ],
        },
      ]))

    it('should export an object type alias with query types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithQueryTypes',
          children: [
            { name: 'a', type: '(a1: string) => number' },
            { name: 'b', type: 'typeof testConstA' },
          ],
        },
      ]))

    it('should export an object type alias with nested object literal types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithNestedObjectLiteralTypes',
          children: [
            { name: 'a', type: 'string' },
            { name: 'b', type: '{ b1: boolean; b2: () => number }', optional: true },
            { name: 'c', type: '{ c1: { c1a: boolean; c1b: number[] }; c2: number }' },
          ],
        },
      ]))

    it('should export an object type alias with template literal types types', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithTemplateLiteralTypes',
          children: [
            { name: 'a', type: '`${LiteralType} 1, ${LiteralType} 2`' },
            { name: 'b', type: '`${TemplateLiteralHeads | TemplateLiteralTails}_test`' },
          ],
        },
      ]))

    it('should export an object type alias with a description', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithDescriptions',
          description: 'Description',
          children: [
            { name: 'a', type: 'boolean' },
            { name: 'b', type: 'string' },
            { name: 'c', type: 'number[]', description: 'Description C' },
          ],
        },
      ]))

    it('should export an object type alias with a description tag', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithDescriptionTags',
          description: 'Description',
          children: [
            { name: 'a', type: 'boolean', description: 'Description A' },
            { name: 'b', type: 'string', description: 'Description B1 Description B2' },
          ],
        },
      ]))
  })

  describe('mapped types', () => {
    it('should export a basic mapped type', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithMappedType<T>',
          children: [{ name: '[key in keyof T]', type: 'number | boolean' }],
        },
      ]))

    it('should export a mapped type adding the optional modifier', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithMappedTypeOptionalModifier<T>',
          children: [{ name: '[key in keyof T]', type: 'boolean', optional: true }],
        },
      ]))

    it('should export a mapped type without the readonly modifier', () =>
      assertMarkdownDefinitions(definitions, [
        {
          name: 'WithMappedTypeReadonlyModifier<T>',
          children: [{ name: '[key in keyof T]', type: 'number[]' }],
        },
      ]))
  })
})
