import {
  Definition,
  DefinitionChild,
  Definitions,
  isInterfaceDefinition,
  isTypeAliasDefinition,
  isObjectTypeAliasDefinition,
  TypeAliasDefinition,
} from 'typedown-shared'
import prettier from 'prettier/standalone'
import parserMarkdown from 'prettier/parser-markdown'

export function getDefinitionsMarkdown(definitions: Definitions): string {
  const markdown = definitions
    .map((definition) =>
      [`# ${definition.name}`, '\n', getDefinitionDescription(definition), getDefinitionContent(definition)].join('\n')
    )
    .join('\n\n')

  return formatMarkdown(markdown)
}

export function escapeMarkdown(markdown: string): string {
  return markdown.replace(/\|/g, '\\|')
}

export function formatMarkdown(markdown: string): string {
  return prettier.format(markdown, { parser: 'markdown', plugins: [parserMarkdown] })
}

function getDefinitionContent(definition: Definition): string {
  if (isInterfaceDefinition(definition) || isObjectTypeAliasDefinition(definition)) {
    return getDefinitionChildren(definition.children)
  } else if (isTypeAliasDefinition(definition)) {
    return getDefinitionTypeAlias(definition)
  }

  return ''
}

function getDefinitionDescription(definition: Definition): string {
  return definition.description && !isTypeAliasDefinition(definition) ? `${definition.description}\n` : ''
}

function getDefinitionChildren(children: DefinitionChild[]): string {
  return getTable([
    ...getTableHeader(['Name', 'Description', 'Type', 'Optional', 'Default value']),
    ...children.map(getDefinitionChild),
  ])
}

function getDefinitionChild(child: DefinitionChild): string {
  return getTableRow([
    child[0],
    escapeMarkdown(child[1]),
    getType(child[2]),
    child[3] ? '✓' : '',
    escapeMarkdown(child[4]),
  ])
}

function getDefinitionTypeAlias(definition: TypeAliasDefinition): string {
  return getTable([
    ...getTableHeader(['Description', 'Type']),
    getTableRow([escapeMarkdown(definition.description), getType(definition.type)]),
  ])
}

function getType(type: string): string {
  return `\`${escapeMarkdown(type)}\``
}

function getTable(rows: string[]): string {
  return rows.join('\n')
}

function getTableHeader(headers: string[]): string[] {
  return [getTableRow(headers), getTableRow(new Array(headers.length).fill('---'))]
}

function getTableRow(columns: string[]): string {
  return `| ${columns.join('|')} |`
}
