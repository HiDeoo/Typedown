import type { DefinitionChild, Definitions } from 'typedown-shared'
import prettier from 'prettier/standalone'
import parserMarkdown from 'prettier/parser-markdown'

export function getDefinitionsMarkdown(definitions: Definitions): string {
  const markdown = definitions
    .map(
      (definition) => `# ${definition.name}

${getDefinitionChildrenMarkdown(definition.children)}`
    )
    .join('\n\n')

  return formatMarkdown(markdown)
}

export function formatMarkdown(markdown: string): string {
  return prettier.format(markdown, { parser: 'markdown', plugins: [parserMarkdown] })
}

function getDefinitionChildrenMarkdown(children: DefinitionChild[]): string {
  return `| Name | Description | Type | Optional | Default value |
| --- | --- | --- | --- | --- |
${children.map(getDefinitionChildMarkdown).join('\n')}`
}

function getDefinitionChildMarkdown(child: DefinitionChild): string {
  return `| ${child[0]} | ${child[1]} | \`${child[2]}\` | ${child[3] ? '✓' : ''} | ${child[4]} |`
}
